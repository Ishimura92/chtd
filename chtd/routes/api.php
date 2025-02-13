<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\TokenController;
use App\Http\Controllers\FriendRequestController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FriendshipController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PresentController;
use App\Http\Controllers\Api\MetadataController;

Route::post('/register', [RegisterController::class, 'register']);
Route::get('/test', function() {
    return 'API route works!';
});
Route::post('/logout', [LogoutController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/login', [LoginController::class, 'login']);
Route::post('/refresh-token', [TokenController::class, 'refresh'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/friendships/pending', [FriendshipController::class, 'getPendingRequests']);
    Route::post('/friendships/{id}/accept', [FriendshipController::class, 'accept']);
    Route::post('/friendships/{id}/reject', [FriendshipController::class, 'reject']);
    Route::get('/friendships', [FriendshipController::class, 'index']);
    Route::post('/friendships', [FriendshipController::class, 'store']);
    Route::get('/users/search', [UserController::class, 'search']);
    Route::delete('/friendships/{id}', [FriendshipController::class, 'destroy']);
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::post('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/avatar', [UserController::class, 'uploadAvatar']);
    Route::get('/presents', [PresentController::class, 'index']);
    Route::post('/presents', [PresentController::class, 'store']);
    Route::put('/presents/{present}', [PresentController::class, 'update']);
    Route::delete('/presents/{present}', [PresentController::class, 'destroy']);
    Route::post('/presents/fetch-metadata', [PresentController::class, 'fetchMetadata']);
    Route::post('/metadata', [MetadataController::class, 'fetch']);
    Route::post('/upload-image', [PresentController::class, 'uploadImage']);
}); 