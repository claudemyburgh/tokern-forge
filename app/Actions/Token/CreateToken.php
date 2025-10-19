<?php

namespace App\Actions\Token;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class CreateToken
{

    public function handle(User $user, array $attributes)
    {
        DB::transaction(function () use ($user, $attributes) {
            dd($attributes);
        });
    }

}
