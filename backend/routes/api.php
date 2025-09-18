<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JobController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Admin\AdminDashboardController;
use Illuminate\Support\Facades\Broadcast; // 1. IMPORTANT : AJOUTER CET IMPORT

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// =========================================================================
// GROUPE 1: ROUTES PUBLIQUES
// =========================================================================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [ForgotPasswordController::class, 'reset']);

Route::get('/jobs', [JobController::class, 'index']);
Route::get('/jobs/{job}', [JobController::class, 'show']);


// =========================================================================
// GROUPE 2: ROUTES PROTÉGÉES (L'utilisateur DOIT être connecté)
// =========================================================================
Route::middleware('auth:sanctum')->group(function () {

    // --- 2. LA CORRECTION FINALE EST ICI ---
    // On déclare manuellement la route d'authentification pour le broadcasting
    // A l'intérieur du groupe qui utilise déjà 'auth:sanctum'.
    Broadcast::routes();

    // Authentification
    Route::get('/user', function (Request $request) { return $request->user(); });
    Route::post('/logout', [AuthController::class, 'logout']);

    // Gestion des Offres (pour Recruteurs)
    Route::post('/jobs', [JobController::class, 'store']);
    Route::put('/jobs/{job}', [JobController::class, 'update']);
    Route::delete('/jobs/{job}', [JobController::class, 'destroy']);
    Route::get('/my-jobs', [JobController::class, 'myJobs']);

    // Candidatures
    Route::post('/jobs/{job}/apply', [ApplicationController::class, 'apply']);
    Route::patch('/applications/{application}/status', [ApplicationController::class, 'updateStatus']);
    Route::get('/my-applications', [ApplicationController::class, 'getForCandidate']);
    Route::get('/jobs/{job}/applications', [ApplicationController::class, 'getForRecruiter']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{notificationId}/read', [NotificationController::class, 'markAsRead']);

    // Chat
    Route::prefix('chat')->group(function () {
        Route::get('/conversations', [ChatController::class, 'getConversations']);
        Route::post('/conversations/start', [ChatController::class, 'startConversation']);
        Route::get('/conversations/{conversation}/messages', [ChatController::class, 'getMessages']);
        Route::post('/conversations/{conversation}/messages', [ChatController::class, 'sendMessage']);
    });
});


// =========================================================================
// GROUPE 3: ROUTES ADMIN
// =========================================================================
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard-stats', [AdminDashboardController::class, 'getStats']);
    Route::apiResource('users', UserController::class)->except(['store', 'show']);
   Route::get('/jobs', [JobController::class, 'adminIndex']);
});
