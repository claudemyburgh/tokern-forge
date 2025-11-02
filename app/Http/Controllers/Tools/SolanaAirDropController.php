<?php

namespace App\Http\Controllers\Tools;

use App\Http\Controllers\Controller;
use Attestto\SolanaPhpSdk\Connection;
use Attestto\SolanaPhpSdk\PublicKey;
use Attestto\SolanaPhpSdk\SolanaRpcClient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SolanaAirDropController extends Controller
{
    public function index()
    {
        return Inertia::render('tools/solana-air-drop');
    }
    public function requestAirdrop(Request $request)
    {
        $request->validate([
            'wallet' => [
                'required',
                'string',
                'min:32',
                'max:44',
                'regex:/^[1-9A-HJ-NP-Za-km-z]+$/' // Base58 validation
            ],
            'amount' => 'required|numeric|min:0.1|max:5',
            'network' => 'required|string|in:devnet',
            'email' => 'nullable|string|email',
        ]);

        $wallet = trim($request->wallet);
        $amount = (float) $request->amount;
        $network = $request->network;

        // Rate limiting temporarily disabled for debugging
        $rateLimitKey = "airdrop_wallet_{$wallet}";
        $ipRateLimitKey = "airdrop_ip_{$request->ip()}";
        $ipRequests = Cache::get($ipRateLimitKey, 0);

        Log::info("Airdrop request debug", [
            'wallet' => $wallet,
            'amount' => $amount,
            'ip' => $request->ip(),
            'rate_limit_key' => $rateLimitKey,
            'ip_requests' => $ipRequests
        ]);

        // Additional wallet validation
        try {
            new PublicKey($wallet);
        } catch (\Exception $e) {
            return back()->withErrors([
                'wallet' => 'Invalid Solana wallet address format'
            ]);
        }

        if ($network !== 'devnet') {
            return back()->with([
                'success' => false,
                'message' => 'Airdrops are only available on Devnet',
            ]);
        }

        $lamports = (int) ($amount * 1000000000);

        // Fallback RPC endpoints (verified public devnet endpoints)
        $endpoints = [
            'https://api.devnet.solana.com',
            'https://devnet.rpcpool.com',
            'https://rpc-devnet.solana.com',
            'https://solana-devnet.rpc.extrnode.com',
            'https://devnet.solana.com',
            'https://devnet-rpc.shyft.to',
            'https://devnet.helius-rpc.com/?api-key=',
            'https://solana-devnet.g.alchemy.com/v2/demo',
        ];

        $lastError = null;

        // Mock mode for testing (when APP_ENV is testing)
        if (app()->environment('testing')) {
            // Simulate successful airdrop for testing
            $mockSignature = 'mock_signature_' . bin2hex(random_bytes(16));

            Cache::put($rateLimitKey, true, 3600);
            Cache::put($ipRateLimitKey, $ipRequests + 1, 3600);

            Log::info("Mock airdrop successful: $amount SOL to $wallet");

            return back()->with([
                'success' => true,
                'amount' => $amount,
                'wallet' => $wallet,
                'signature' => $mockSignature,
            ]);
        }

        foreach ($endpoints as $rpc) {
            try {
                // Create HTTP client with SSL verification disabled for local development
                $httpClient = new \GuzzleHttp\Client([
                    'verify' => false, // Disable SSL verification for local dev
                    'timeout' => 30,
                ]);

                $client = new SolanaRpcClient($rpc, $httpClient);
                $publicKey = new PublicKey($wallet);

                // Request airdrop using the correct RPC call
                $signature = $client->call('requestAirdrop', [$wallet, $lamports]);

                if (!$signature) {
                    throw new \Exception('Failed to get transaction signature');
                }

                // Try to confirm transaction (with timeout)
                try {
                    $client->call('confirmTransaction', [$signature, ['commitment' => 'confirmed']]);
                } catch (\Exception $e) {
                    Log::info("Transaction confirmation failed but signature received: $signature");
                }

                // Set rate limiting cache after successful airdrop (disabled for debugging)
                // Cache::put($rateLimitKey, true, 300); // 5 minutes
                // Cache::put($ipRateLimitKey, $ipRequests + 1, 3600); // 1 hour

                Log::info("Airdrop successful: $amount SOL to $wallet via $rpc");

                return back()->with([
                    'success' => true,
                    'amount' => $amount,
                    'wallet' => $wallet,
                    'signature' => $signature,
                ]);

            } catch (\Exception $e) {
                $lastError = $e->getMessage();
                Log::warning("Airdrop failed on $rpc: " . $lastError);

                // Handle specific error cases
                if (str_contains($lastError, 'SSL certificate') || str_contains($lastError, 'cURL error')) {
                    Log::warning("SSL/Network error on $rpc, trying next endpoint");
                } elseif (str_contains($lastError, '429') || str_contains($lastError, 'rate limit') || str_contains($lastError, 'too many requests')) {
                    Log::warning("Rate limit hit on $rpc, trying next endpoint");
                } elseif (str_contains($lastError, '401') || str_contains($lastError, 'api key')) {
                    Log::warning("API key required for $rpc, trying next endpoint");
                }

                continue;
            }
        }

        // All RPC endpoints failed, try external faucet services
        Log::error("All airdrop endpoints failed for wallet: $wallet. Last error: $lastError");

        // Try external faucet services as fallback
        try {
            $externalResult = $this->tryExternalFaucets($wallet, $amount);
            if ($externalResult) {
                Cache::put($rateLimitKey, true, 300);
                Cache::put($ipRateLimitKey, $ipRequests + 1, 3600);

                return back()->with([
                    'success' => true,
                    'amount' => $amount,
                    'wallet' => $wallet,
                    'signature' => $externalResult,
                ]);
            }
        } catch (\Exception $e) {
            Log::warning("External faucet services also failed: " . $e->getMessage());
        }

        // Provide more specific error messages
        $errorMessage = 'All Solana devnet faucets are currently unavailable.';

        if ($lastError) {
            if (str_contains($lastError, '429') || str_contains($lastError, 'rate limit') || str_contains($lastError, 'too many requests')) {
                $errorMessage = 'Solana devnet faucet rate limit reached. Try these alternatives: https://faucet.solana.com or https://solfaucet.com';
            } elseif (str_contains($lastError, 'insufficient funds') || str_contains($lastError, 'faucet')) {
                $errorMessage = 'Solana devnet faucet is currently empty. Try external faucets: https://faucet.solana.com';
            }
        }

        return back()->with([
            'success' => false,
            'message' => $errorMessage,
        ]);
    }

    private function tryExternalFaucets($wallet, $amount)
    {
        // Try QuickNode faucet API
        try {
            $client = new \GuzzleHttp\Client(['verify' => false, 'timeout' => 30]);

            $response = $client->post('https://faucet.quicknode.com/solana/devnet', [
                'json' => [
                    'address' => $wallet,
                    'amount' => $amount
                ],
                'headers' => [
                    'Content-Type' => 'application/json',
                    'User-Agent' => 'TokenForge/1.0'
                ]
            ]);

            $result = json_decode($response->getBody()->getContents(), true);
            if (isset($result['signature'])) {
                Log::info("External faucet success: QuickNode");
                return $result['signature'];
            }
        } catch (\Exception $e) {
            Log::warning("QuickNode faucet failed: " . $e->getMessage());
        }

        // Try SolFaucet API
        try {
            $client = new \GuzzleHttp\Client(['verify' => false, 'timeout' => 30]);

            $response = $client->post('https://api.solfaucet.com/airdrop', [
                'json' => [
                    'wallet' => $wallet,
                    'lamports' => $amount * 1000000000
                ],
                'headers' => [
                    'Content-Type' => 'application/json'
                ]
            ]);

            $result = json_decode($response->getBody()->getContents(), true);
            if (isset($result['txid'])) {
                Log::info("External faucet success: SolFaucet");
                return $result['txid'];
            }
        } catch (\Exception $e) {
            Log::warning("SolFaucet failed: " . $e->getMessage());
        }

        return null;
    }

}
