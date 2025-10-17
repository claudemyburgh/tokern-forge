<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('user can upload an avatar', function () {
    Storage::fake('public');

    $user = User::factory()->create();

    $avatar = UploadedFile::fake()->image('avatar.jpg', 200, 200);

    $response = $this
        ->actingAs($user)
        ->post(route('avatar.update'), [
            'avatar' => $avatar,
        ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    // Assert that the avatar was stored
    expect($user->fresh()->getMedia('avatar'))->toHaveCount(1);

    // Assert that the conversions were created
    $media = $user->fresh()->getFirstMedia('avatar');
    expect($media->hasGeneratedConversion('80x80'))->toBeTrue()
        ->and($media->hasGeneratedConversion('160x160'))->toBeTrue()
        ->and($media->hasGeneratedConversion('320x320'))->toBeTrue();
});

test('avatar upload requires authentication', function () {
    $avatar = UploadedFile::fake()->image('avatar.jpg');

    $response = $this->post(route('avatar.update'), [
        'avatar' => $avatar,
    ]);

    $response->assertRedirect(route('login'));
});

test('avatar upload requires valid image file', function () {
    $user = User::factory()->create();

    $invalidFile = UploadedFile::fake()->create('document.pdf', 100);

    $response = $this
        ->actingAs($user)
        ->post(route('avatar.update'), [
            'avatar' => $invalidFile,
        ]);

    $response->assertSessionHasErrors('avatar');
});

test('avatar upload requires file under 2MB', function () {
    $user = User::factory()->create();

    $largeFile = UploadedFile::fake()->image('large-avatar.jpg')->size(3000); // 3MB

    $response = $this
        ->actingAs($user)
        ->post(route('avatar.update'), [
            'avatar' => $largeFile,
        ]);

    $response->assertSessionHasErrors('avatar');
});

test('user can delete their avatar', function () {
    Storage::fake('public');

    $user = User::factory()->create();

    // First upload an avatar
    $avatar = UploadedFile::fake()->image('avatar.jpg', 200, 200);

    $this
        ->actingAs($user)
        ->post(route('avatar.update'), [
            'avatar' => $avatar,
        ]);

    expect($user->fresh()->getMedia('avatar'))->toHaveCount(1);

    // Now delete the avatar
    $response = $this
        ->actingAs($user)
        ->delete(route('avatar.destroy'));

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    // Assert that the avatar was deleted
    expect($user->fresh()->getMedia('avatar'))->toHaveCount(0);
});

test('avatar deletion requires authentication', function () {
    $response = $this->delete(route('avatar.destroy'));

    $response->assertRedirect(route('login'));
});

test('user can replace existing avatar with new one', function () {
    Storage::fake('public');

    $user = User::factory()->create();

    // Upload first avatar
    $firstAvatar = UploadedFile::fake()->image('avatar1.jpg', 200, 200);

    $this
        ->actingAs($user)
        ->post(route('avatar.update'), [
            'avatar' => $firstAvatar,
        ]);

    $user->refresh();
    $firstMedia = $user->getFirstMedia('avatar');
    $firstMediaId = $firstMedia->id;

    expect($user->getMedia('avatar'))->toHaveCount(1);

    // Upload second avatar
    $secondAvatar = UploadedFile::fake()->image('avatar2.jpg', 300, 300);

    $response = $this
        ->actingAs($user)
        ->post(route('avatar.update'), [
            'avatar' => $secondAvatar,
        ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    // Assert that only one avatar exists and it's the new one
    $user->refresh();
    expect($user->getMedia('avatar'))->toHaveCount(1);

    $secondMedia = $user->getFirstMedia('avatar');
    expect($secondMedia->id)->not->toBe($firstMediaId);
});
