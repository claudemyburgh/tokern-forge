<?php

namespace App\Actions\Token;

use App\Models\Token;

class ViewTokens
{

    public function handle()
    {
        return Token::paginate(12);
    }

}
