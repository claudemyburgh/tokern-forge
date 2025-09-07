<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;

class SocialiteController extends Controller
{
    public function redirect(string $provider)
    {
        return Socialite::driver($provider)->redirect();
    }

    public function callback(string $provider)
    {
        $socialiteUser = Socialite::driver($provider)->user();

        $user = User::where('email', $socialiteUser->getEmail())->first();

        if ($user) {
            $user->update([
                'provider' => $provider,
                'provider_id' => $socialiteUser->getId(),
                'provider_token' => $socialiteUser->token,
            ]);
        } else {
            $user = User::create([
                'name' => $socialiteUser->getName(),
                'email' => $socialiteUser->getEmail(),
                'provider' => $provider,
                'provider_id' => $socialiteUser->getId(),
                'provider_token' => $socialiteUser->token,
                'password' => null,
            ]);
        }

        Auth::login($user);

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
