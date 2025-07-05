<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UtilisateurController extends Controller
{



    /**
     * Lister tous les utilisateurs
     *
     * Récupère la liste de tous les utilisateurs.
     *
     * @group Gestion des Utilisateurs
     * @response 200 [
     *   {
     *     "userId": 1,
     *     "username": "johndoe",
     *     "email": "john@example.com",
     *     "adresse": "123 Rue Principale, Ville",
     *     "role": "user",
     *     "createdAt": "2025-05-19T18:15:00+01:00",
     *     "updated_at": "2025-05-19T18:15:00+01:00"
     *   },
     *   {
     *     "userId": 2,
     *     "username": "janedoe",
     *     "email": "jane@example.com",
     *     "adresse": null,
     *     "role": "admin",
     *     "createdAt": "2025-05-19T18:15:00+01:00",
     *     "updated_at": "2025-05-19T18:15:00+01:00"
     *   }
     * ]
     */
    public function index()
    {
        return Utilisateur::all();
    }









    /**
     * Créer un nouvel utilisateur
     *
     * Crée un nouvel utilisateur dans la base de données.
     *
     * @group Gestion des Utilisateurs
     * @bodyParam username string required Le nom d'utilisateur (max 255 caractères). Example: johndoe
     * @bodyParam email string required L'adresse e-mail de l'utilisateur (doit être unique). Example: john@example.com
     * @bodyParam password string required Le mot de passe de l'utilisateur (minimum 6 caractères). Example: secret123
     * @bodyParam adresse string optional L'adresse de l'utilisateur (max 255 caractères). Example: 123 Rue Principale, Ville
     * @bodyParam role string required Le rôle de l'utilisateur (user ou admin). Example: user
     * @response 201 {
     *   "userId": 1,
     *   "username": "johndoe",
     *   "email": "john@example.com",
     *   "adresse": "123 Rue Principale, Ville",
     *   "role": "user",
     *   "createdAt": "2025-05-19T18:15:00+01:00",
     *   "updated_at": "2025-05-19T18:15:00+01:00"
     * }
     * @response 422 {
     *   "errors": {
     *     "email": ["The email has already been taken."]
     *   }
     * }
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|max:255',
            'email' => 'required|email|unique:utilisateur,email',
            'password' => 'required|string|min:6',
            'adresse' => 'nullable|string|max:255',
            'role' => 'required|in:user,admin',
        ]);

        $utilisateur = Utilisateur::create([
            'username' => $validated['username'],
            'email' => $validated['email'],
            'passwordHash' => Hash::make($validated['password']),
            'adresse' => $validated['adresse'] ?? null,
            'role' => $validated['role'],
            'createdAt' => now(),
        ]);

        return response()->json($utilisateur, 201);
    }








    /**
     * Récupérer un utilisateur spécifique
     *
     * Récupère les détails d'un utilisateur par son ID.
     *
     * @group Gestion des Utilisateurs
     * @response 200 {
     *   "userId": 1,
     *   "username": "johndoe",
     *   "email": "john@example.com",
     *   "adresse": "123 Rue Principale, Ville",
     *   "role": "user",
     *   "createdAt": "2025-05-19T18:15:00+01:00",
     *   "updated_at": "2025-05-19T18:15:00+01:00"
     * }
     * @response 404 {
     *   "message": "Not found."
     * }
     */
    public function show(string $id)
    {
        return Utilisateur::findOrFail($id);
    }












    /**
     * Mettre à jour un utilisateur
     *
     * Met à jour les détails d'un utilisateur existant par son ID.
     *
     * @group Gestion des Utilisateurs
     * @bodyParam username string required Le nom d'utilisateur (max 255 caractères). Example: johndoe
     * @bodyParam email string required L'adresse e-mail de l'utilisateur (doit être unique). Example: john@example.com
     * @bodyParam password string optional Le nouveau mot de passe de l'utilisateur (minimum 6 caractères). Example: newsecret123
     * @bodyParam adresse string optional L'adresse de l'utilisateur (max 255 caractères). Example: 456 Avenue Secondaire, Ville
     * @bodyParam role string required Le rôle de l'utilisateur (user ou admin). Example: admin
     * @response 200 {
     *   "userId": 1,
     *   "username": "johndoe",
     *   "email": "john@example.com",
     *   "adresse": "456 Avenue Secondaire, Ville",
     *   "role": "admin",
     *   "createdAt": "2025-05-19T18:15:00+01:00",
     *   "updated_at": "2025-05-19T18:16:00+01:00"
     * }
     * @response 422 {
     *   "errors": {
     *     "email": ["The email has already been taken."]
     *   }
     * }
     * @response 404 {
     *   "message": "Not found."
     * }
     */
    public function update(Request $request, string $id)
    {
        $utilisateur = Utilisateur::findOrFail($id);

        $validated = $request->validate([
            'username' => 'required|string|max:255',
            'email' => 'required|email|unique:utilisateur,email,' . $id . ',userId',
            'password' => 'nullable|string|min:6',
            'adresse' => 'nullable|string|max:255',
            'role' => 'required|in:user,admin',
        ]);

        $utilisateur->update([
            'username' => $validated['username'],
            'email' => $validated['email'],
            'adresse' => $validated['adresse'] ?? null,
            'role' => $validated['role'],
            ...(isset($validated['password']) ? ['passwordHash' => Hash::make($validated['password'])] : []),
        ]);

        return response()->json($utilisateur, 200);
    }













    /**
     * Supprimer un utilisateur
     *
     * Supprime un utilisateur de la base de données par son ID.
     *
     * @group Gestion des Utilisateurs
     * @response 204 {}
     * @response 404 {
     *   "message": "Not found."
     * }
     */
    public function destroy(string $id)
    {
        $utilisateur = Utilisateur::findOrFail($id);
        $utilisateur->delete();
        return response()->json(null, 204);
    }
}
