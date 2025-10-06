<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Spatie\MediaLibrary\MediaCollections\Exceptions\FileDoesNotExist;
use Spatie\MediaLibrary\MediaCollections\Exceptions\FileIsTooBig;

class AvatarController extends Controller
{
    /**
     * @throws FileDoesNotExist
     * @throws FileIsTooBig
     */
    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'avatar' => ['required', 'image', 'max:2048'], // 2MB max
        ]);

        $user = $request->user();

        // Clear existing avatar first
        $user->clearMediaCollection('avatar');

        // Add new avatar and generate conversions
        $user->addMediaFromRequest('avatar')
            ->toMediaCollection('avatar');

        return redirect()->back()->with('success', 'Avatar updated successfully.');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->user()->clearMediaCollection('avatar');

        return redirect()->back()->with('success', 'Avatar deleted successfully.');
    }
}
