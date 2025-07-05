<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): Response
    {
        $request->validate([
            'username' => ['required', 'string', 'max:50'],  // Changed 'name' to 'username'
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:utilisateur'],  // Change 'User' to 'utilisateur'
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Create the user using the Utilisateur model
        $user = Utilisateur::create([
            'username' => $request->username,  // Changed 'name' to 'username'
            'email' => $request->email,
            'passwordHash' => Hash::make($request->password),  // Use passwordHash instead of 'password'
            'role' => 'user',  // You can set a default role if needed
            'adresse' => $request->adresse ?? null,  // Use 'adresse' if provided, otherwise set as null
        ]);

        // Trigger the Registered event
        event(new Registered($user));

        // Log the user in
        Auth::login($user);

        // Return no content response after successful registration
        return response()->noContent();
    }
}
