<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;


// use JWT (json web Token instead of CSRF )
class AuthController extends Controller
{


    /**
     * Register a new user
     *
     * Creates a new user account and returns the user details along with an authentication token.
     *
     * @group Authentication
     * @bodyParam username string required The username of the user (max 50 characters). Example: johndoe
     * @bodyParam email string required The email address of the user (max 100 characters, must be unique). Example: john@example.com
     * @bodyParam password string required The password for the user (min 6 characters). Example: secret123
     * @bodyParam adresse string optional The address of the user. Example: 123 Main St, City
     * @response 201 {
     *   "user": {
     *     "id": 1,
     *     "username": "johndoe",
     *     "email": "john@example.com",
     *     "adresse": "123 Main St, City",
     *     "role": "user",
     *     "created_at": "2025-05-19T17:56:00+01:00",
     *     "updated_at": "2025-05-19T17:56:00+01:00"
     *   },
     *   "token": "1|randomtokenstring"
     * }
     * @response 422 {
     *   "errors": {
     *     "email": ["The email has already been taken."]
     *   }
     * }
     */

    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:50',
            'email' => 'required|email|max:100|unique:utilisateur',
            'password' => 'required|string|min:6',
            'adresse' => 'nullable|string',
        ]);

        $user = Utilisateur::create([
            'username' => $request->username,
            'email' => $request->email,
            'passwordHash' => Hash::make($request->password),
            'adresse' => $request->adresse,
            'role' => 'user',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }








    /**
     * Log in a user
     *
     * Authenticates a user with their email and password, returning the user details and an authentication token.
     *
     * @group Authentication
     * @bodyParam email string required The email address of the user. Example: john@example.com
     * @bodyParam password string required The password of the user. Example: secret123
     * @response 200 {
     *   "user": {
     *     "id": 1,
     *     "username": "johndoe",
     *     "email": "john@example.com",
     *     "adresse": "123 Main St, City",
     *     "role": "user",
     *     "created_at": "2025-05-19T17:56:00+01:00",
     *     "updated_at": "2025-05-19T17:56:00+01:00"
     *   },
     *   "token": "1|randomtokenstring"
     * }
     * @response 422 {
     *   "errors": {
     *     "email": ["The provided credentials are incorrect."]
     *   }
     * }
     */


    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = Utilisateur::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->passwordHash)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }








    /**
     * Log out the authenticated user
     *
     * Revokes the current authentication token, logging out the user.
     *
     * @group Authentication
     * @authenticated
     * @response 200 {
     *   "message": "Logged out"
     * }
     * @response 401 {
     *   "message": "Unauthenticated."
     * }
     */

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out']);
    }
}
