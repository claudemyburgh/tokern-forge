<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTokenRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'symbol' => 'required|string|max:10|unique:tokens,symbol',
            'decimal' => 'required|integer|min:0|max:18',
            'supply' => 'required|integer|min:1',
            'description' => 'required|string|max:1000',
            'website' => 'nullable|url',
            'twitter' => 'nullable|url',
            'discord' => 'nullable|url',
            'telegram' => 'nullable|url',
            'facebook' => 'nullable|url',
            'youtube' => 'nullable|url',
            'revoke_mint' => 'boolean',
            'revoke_update' => 'boolean',
            'image' => 'required|image|mimes:png,jpg,jpeg,webp,gif|max:5120', // 5MB max
            'action' => 'required|in:draft,create',
            'wallet_address' => 'nullable|string|size:44', // Solana address length
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'image.required' => 'A meme image is required for your token.',
            'image.image' => 'The uploaded file must be an image.',
            'image.mimes' => 'The image must be a PNG, JPG, JPEG, WebP, or GIF file.',
            'image.max' => 'The image size must not exceed 5MB.',
            'symbol.unique' => 'This token symbol is already taken.',
        ];
    }
}
