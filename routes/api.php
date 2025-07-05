<?php


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\UtilisateurController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\PanierController;
use App\Http\Controllers\API\CommandeController;
use App\Http\Controllers\API\CommentaireController;
use App\http\Controllers\API\StripeController;




// Authentication route
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Products route (does not need authentication )
Route::get('products', [ProductController::class, 'index']);
Route::get('products/{product}', [ProductController::class, 'show']);


// All the route that needs authentication 
Route::middleware('auth:sanctum')->group(function () {
    // logout route 
    Route::post('/logout', [AuthController::class, 'logout']);

    // products route ressource (store,update ,destroy) 
    Route::apiResource('products', ProductController::class)->except(['show', 'index']);

    // a simple route that returns the current logged in user
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // cart route ressource (index,store,update ,destroy)
    Route::apiResource('panier', PanierController::class);

    // commands route (index,store,show)
    Route::apiResource('commandes', CommandeController::class);



    // Stripe Route (for payment integration)
    Route::post('stripe/pay', [StripeController::class, 'PayByStripe']);
});




// route for products categories 
Route::apiResource('categories', CategoryController::class);

// route for the user (NOTE: use Utilisateur model instead of User)
Route::apiResource('users', UtilisateurController::class);


// all ressource route for products comments 
Route::get('/commentaires', [CommentaireController::class, 'index']);
Route::post('/commentaires', [CommentaireController::class, 'store']);
Route::get('/commentaires/{commentaire}', [CommentaireController::class, 'show']);
Route::put('/commentaires/{commentaire}', [CommentaireController::class, 'update']);
Route::delete('/commentaires/{commentaire}', [CommentaireController::class, 'destroy']);
