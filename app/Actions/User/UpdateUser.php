<?php

namespace App\Actions\User;

use App\Models\User;

class UpdateUser
{
    public function handle(User $user, array $data)
    {
        $userData = [
            'name' => $data['name'],
            'email' => $data['email'],
        ];

        // Only update password if provided
        if (isset($data['password']) && ! empty($data['password'])) {
            $userData['password'] = bcrypt($data['password']);
        }

        $user->update($userData);

        if (isset($data['roles'])) {
            $user->syncRoles($data['roles']);
        }

        return $user;
    }
}
