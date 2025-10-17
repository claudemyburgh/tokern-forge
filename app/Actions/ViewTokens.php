<?php

namespace App\Actions;

use App\Models\Token;

class ViewTokens
{

    public function handle()
    {
        return Token::paginate(12);
    }

}
