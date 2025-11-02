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
        $amount = $request->input('amount');
        $email = $request->input('email');

        // Convert SOL to lamports (1 SOL = 1,000,000,000 lamports)
        $lamports = (int) (round($amount * 1000000000));

        Log::info('Processing airdrop request', [
            'wallet' => $wallet,
            'amount' => $amount,
            'lamports' => $lamports,
            'email' => $email,
        ]);

        try {
            // METHOD 1: Try direct RPC call to Solana Devnet (most reliable)
            Log::info('Attempting airdrop via RPC');
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

                return back()->with([
                    'success' => true,
                    'message' => 'Airdrop successful',
                    'signature' => $signature,
                    'wallet' => $wallet,
                    'amount' => $amount,
                ]);
            }

            Log::info('RPC method failed, trying faucet method');

            // METHOD 2: Try official Solana faucet as fallback
            $response = Http::timeout(30)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                ])
                ->post('https://faucet.solana.com/api/request', [
                    'recipient' => $wallet,
                    'amount' => $lamports,
                ]);

            Log::info('Faucet response', [
                'status' => $response->status(),
                'body' => $response->body(),
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

                return back()->with([
                    'success' => true,
                    'message' => 'Airdrop successful',
                    'signature' => $data['signature'] ?? null,
                    'wallet' => $wallet,
                    'amount' => $amount,
                ]);
            }

            // If both methods fail
            $errorMessage = 'Unable to process airdrop. The devnet faucet may be temporarily unavailable.';
            $responseBody = $response->body();
            $responseData = json_decode($responseBody, true);

            // Check for specific error messages from the faucet
            if ($responseData && isset($responseData['error'])) {
                if (isset($responseData['error']['message'])) {
                    $errorMessage = $responseData['error']['message'];
                } elseif (is_string($responseData['error'])) {
                    $errorMessage = $responseData['error'];
                }
            }

            if ($response->status() === 429) {
                $errorMessage = 'Rate limit exceeded. You\'ve either reached your airdrop limit today or the airdrop faucet has run dry. Please try again later or use an alternative faucet.';
            }

            Log::error('Airdrop request failed', [
                'status' => $response->status(),
                'response_body' => $responseBody,
                'error_message' => $errorMessage,
            ]);

            throw new \Exception($errorMessage);
        } catch (\Exception $e) {
            Log::error('Solana airdrop failed', [
                'wallet' => $wallet,
                'amount' => $amount,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->with([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Request airdrop directly via Solana Devnet RPC
     */
    private function requestAirdropViaRPC(string $wallet, int $lamports): ?string
    {
        try {
            Log::info('Making RPC request to Solana Devnet', [
                'wallet' => $wallet,
                'lamports' => $lamports,
            ]);

            $response = Http::timeout(30)->post('https://api.devnet.solana.com', [
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
                    return $data['result'];
                }

                if (isset($data['error'])) {
                    Log::warning('RPC airdrop error', ['error' => $data['error']]);
                    
                    // Check for specific error conditions
                    if (isset($data['error']['code']) && $data['error']['code'] == 429) {
                        Log::warning('RPC airdrop rate limited', ['error' => $data['error']]);
                    }
                }
            }

            return null;
        } catch (\Exception $e) {
            Log::error('RPC airdrop failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return null;
        }
    }
}