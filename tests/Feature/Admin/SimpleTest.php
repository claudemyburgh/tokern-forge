<?php

use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('basic test', function () {
    expect(true)->toBeTrue();
});