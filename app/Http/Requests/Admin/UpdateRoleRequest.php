<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRoleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization is handled in the controller
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('roles')
                    ->where('guard_name', $this->input('guard_name', $this->role->guard_name))
                    ->ignore($this->role),
            ],
            'permissions' => 'array',
            'permissions.*' => 'array',
            'permissions.*.*' => 'string',
        ];
    }
}
