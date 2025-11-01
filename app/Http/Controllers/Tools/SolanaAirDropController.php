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
        $validator = Validator::make($request->all(), [
            'wallet' => ['required', 'string', 'regex:/^[1-9A-HJ-NP-Za-km-z]{32,44}$/'],
            'amount' => ['required', 'numeric', 'min:0.1', 'max:5'],
            'email' => ['nullable', 'email'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $wallet = $request->input('wallet');
        $amount = $request->input('amount');
        $email = $request->input('email');

        // Convert SOL to lamports (1 SOL = 1,000,000,000 lamports)
        $lamports = (int) ($amount * 1000000000);

        try {
            // METHOD 1: Try direct RPC call to Solana Devnet (most reliable)
            $signature = $this->requestAirdropViaRPC($wallet, $lamports);

            if ($signature) {
                Log::info('Solana airdrop successful via RPC', [
                    'wallet' => $wallet,
                    'amount' => $amount,
                    'signature' => $signature,
                ]);

                // Send email notification if provided
                if ($email) {
                    // TODO: Implement email notification
                    // Mail::to($email)->send(new AirdropCompleted($wallet, $amount, $signature));
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Airdrop successful',
                    'signature' => $signature,
                    'wallet' => $wallet,
                    'amount' => $amount,
                ]);
            }

            // METHOD 2: Try official Solana faucet as fallback
            $response = Http::timeout(30)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                ])
                ->post('https://faucet.solana.com/api/request', [
                    'recipient' => $wallet,
                    'amount' => $lamports,
                ]);

            if ($response->successful()) {
                $data = $response->json();

                Log::info('Solana airdrop successful via faucet', [
                    'wallet' => $wallet,
                    'amount' => $amount,
                    'signature' => $data['signature'] ?? null,
                ]);

                if ($email) {
                    // TODO: Implement email notification
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Airdrop successful',
                    'signature' => $data['signature'] ?? null,
                    'wallet' => $wallet,
                    'amount' => $amount,
                ]);
            }

            // If both methods fail
            $errorMessage = 'Unable to process airdrop. The devnet faucet may be temporarily unavailable.';

            if ($response->status() === 429) {
                $errorMessage = 'Rate limit exceeded. Please try again in a few minutes.';
            }

            throw new \Exception($errorMessage);

        } catch (\Exception $e) {
            Log::error('Solana airdrop failed', [
                'wallet' => $wallet,
                'amount' => $amount,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Request airdrop directly via Solana Devnet RPC
     */
    private function requestAirdropViaRPC(string $wallet, int $lamports): ?string
    {
        try {
            $response = Http::timeout(30)->post('https://api.devnet.solana.com', [
                'jsonrpc' => '2.0',
                'id' => 1,
                'method' => 'requestAirdrop',
                'params' => [
                    $wallet,
                    $lamports
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();

                if (isset($data['result'])) {
                    return $data['result'];
                }

                if (isset($data['error'])) {
                    Log::warning('RPC airdrop error', ['error' => $data['error']]);
                }
            }

            return null;
        } catch (\Exception $e) {
            Log::error('RPC airdrop failed', ['error' => $e->getMessage()]);
            return null;
        }
    }
}
