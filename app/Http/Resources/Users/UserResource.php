<?php

namespace App\Http\Resources\Users;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{


    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'bio' => $this->bio,
            'avatar' => $this->avatar,
            'avatar_small' => $this->avatar_small,
            'is_super_admin' => $this->isSuperAdmin(),
            'roles' => $request->user()->roles->pluck('name')->toArray(),
            'permissions' => $this->getAllPermissions()->pluck('name'),
//            'permissions' => $request->user()->permissions->pluck('name')->toArray(),
        ];
    }
}
