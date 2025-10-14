<?php

namespace App\Enums;

use function PHPUnit\Framework\matches;

enum SocialEnum: string
{
    case TWITTER = 'twitter';
    case GOOGLE = 'google';
    case FACEBOOK = 'facebook';



}
