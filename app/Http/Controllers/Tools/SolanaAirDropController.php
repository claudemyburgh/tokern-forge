<?php

namespace App\Http\Controllers\Tools;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class SolanaAirDropController extends Controller
{
    public function index()
    {
        return Inertia::render('tools/solana-air-drop');
    }

    public function requestAirdrop(Request $request)
    {
        Log::info('Solana airdrop request received', [
            'wallet' => $request->input('wallet'),
            'amount' => $request->input('amount'),
            'email' => $request->input('email'),
        ]);

        $validator = Validator::make($request->all(), [
            'wallet' => ['required', 'string', 'regex:/^[1-9A-HJ-NP-Za-km-z]{32,44}$/'],
            'amount' => ['required', 'numeric', 'min:0.1', 'max:5'],
            'email' => ['nullable', 'email'],
        ]);

        if ($validator->fails()) {
            Log::warning('Solana airdrop validation failed', [
                'errors' => $validator->errors()->toArray(),
                'input' => $request->all(),
            ]);
            return back()->withErrors($validator)->withInput();
        }

        $wallet = $request->input('wallet');
        $amount = floatval($request->input('amount'));
        $email = $request->input('email');

        // Convert SOL to lamports with proper precision (1 SOL = 1,000,000,000 lamports)
        $lamports = intval($amount * 1000000000);

        Log::info('Processing airdrop request', [
            'wallet' => $wallet,
            'amount' => $amount,
            'lamports' => $lamports,
            'email' => $email,
        ]);

        try {
            // Try multiple RPC endpoints for better reliability
            $endpoints = [
                'https://api.devnet.solana.com',
                'https://api.devnet.solana.com',
                'https://rpc.ankr.com/solana_devnet',
            ];

            $signature = null;
            foreach ($endpoints as $endpoint) {
                Log::info("Attempting airdrop via RPC: {$endpoint}");
                $signature = $this->requestAirdropViaRPC($wallet, $lamports, $endpoint);

                if ($signature) {
                    Log::info('Solana airdrop successful via RPC', [
                        'endpoint' => $endpoint,
                        'wallet' => $wallet,
                        'amount' => $amount,
                        'signature' => $signature,
                    ]);

                    return redirect()->back()->with([
                        'success' => true,
                        'message' => 'Airdrop successful!',
                        'signature' => $signature,
                        'wallet' => $wallet,
                        'amount' => $amount,
                    ]);
                }
            }

            // If all RPC methods fail, provide helpful error
            Log::error('All airdrop methods failed');

            return redirect()->back()->with([
                'success' => false,
                'message' => 'Unable to process airdrop. The devnet faucet may be rate-limited or temporarily unavailable. Please try again in a few minutes or use the official Solana CLI: solana airdrop ' . $amount . ' ' . $wallet . ' --url devnet',
            ]);

        } catch (\Exception $e) {
            Log::error('Solana airdrop failed', [
                'wallet' => $wallet,
                'amount' => $amount,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Request airdrop directly via Solana Devnet RPC
     */
    private function requestAirdropViaRPC(string $wallet, int $lamports, string $endpoint = 'https://api.devnet.solana.com'): ?string
    {
        try {
            Log::info('Making RPC request to Solana Devnet', [
                'endpoint' => $endpoint,
                'wallet' => $wallet,
                'lamports' => $lamports,
            ]);

            $response = Http::timeout(30)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                ])
                ->post($endpoint, [
                    'jsonrpc' => '2.0',
                    'id' => 1,
                    'method' => 'requestAirdrop',
                    'params' => [
                        $wallet,
                        $lamports,
                    ],
                ]);

            Log::info('RPC response received', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            if ($response->successful()) {
                $data = $response->json();

                if (isset($data['result'])) {
                    Log::info('RPC airdrop successful', ['signature' => $data['result']]);

                    // Wait a moment and confirm the transaction
                    sleep(2);
                    $this->confirmTransaction($data['result'], $endpoint);

                    return $data['result'];
                }

                if (isset($data['error'])) {
                    $errorMsg = $data['error']['message'] ?? json_encode($data['error']);
                    Log::warning('RPC airdrop error', [
                        'error' => $data['error'],
                        'code' => $data['error']['code'] ?? null,
                    ]);

                    // Check for rate limiting
                    if (isset($data['error']['code']) && $data['error']['code'] == -32429) {
                        throw new \Exception('Rate limit exceeded. Please wait a few minutes before trying again.');
                    }
                }
            }

            return null;
        } catch (\Exception $e) {
            Log::error('RPC airdrop failed', [
                'endpoint' => $endpoint,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Confirm transaction on the blockchain
     */
    private function confirmTransaction(string $signature, string $endpoint): bool
    {
        try {
            $response = Http::timeout(10)->post($endpoint, [
                'jsonrpc' => '2.0',
                'id' => 1,
                'method' => 'getSignatureStatuses',
                'params' => [
                    [$signature],
                    ['searchTransactionHistory' => true]
                ],
            ]);

            if ($response->successful()) {
                $data = $response->json();
                Log::info('Transaction confirmation', ['data' => $data]);
                return true;
            }

            return false;
        } catch (\Exception $e) {
            Log::warning('Transaction confirmation failed', ['error' => $e->getMessage()]);
            return false;
        }
    }
}
