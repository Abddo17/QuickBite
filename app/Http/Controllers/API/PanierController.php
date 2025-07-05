<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Panier;
use App\Models\Product;
use Illuminate\Http\Request;

class PanierController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }







    /**
     * Lister tous les articles du panier
     *
     * Récupère la liste de tous les articles dans le panier de l'utilisateur authentifié, avec les détails des produits associés.
     *
     * @group Gestion du Panier
     * @authenticated
     * @response 200 [
     *   {
     *     "id": 1,
     *     "userId": 1,
     *     "produitId": 1,
     *     "quantite": 2,
     *     "created_at": "2025-05-19T18:10:00+01:00",
     *     "updated_at": "2025-05-19T18:10:00+01:00",
     *     "product": {
     *       "produitId": 1,
     *       "nom": "Laptop",
     *       "prix": 749.99,
     *       "stock": 10
     *     }
     *   }
     * ]
     * @response 401 {
     *   "message": "Unauthenticated."
     * }
     */


    public function index(Request $request)
    {
        return $request->user()->paniers()->with('product')->get();
    }














    /**
     * Ajouter un article au panier
     *
     * Ajoute un nouvel article au panier de l'utilisateur authentifié, en vérifiant la disponibilité du stock.
     *
     * @group Gestion du Panier
     * @authenticated
     * @bodyParam produitId integer required L'ID du produit à ajouter. Example: 1
     * @bodyParam quantite integer required La quantité du produit (minimum 1). Example: 2
     * @response 201 {
     *   "id": 1,
     *   "userId": 1,
     *   "produitId": 1,
     *   "quantite": 2,
     *   "created_at": "2025-05-19T18:10:00+01:00",
     *   "updated_at": "2025-05-19T18:10:00+01:00",
     *   "product": {
     *     "produitId": 1,
     *     "nom": "Laptop",
     *     "prix": 749.99,
     *     "stock": 10
     *   }
     * }
     * @response 400 {
     *   "message": "Not enough stock"
     * }
     * @response 422 {
     *   "errors": {
     *     "produitId": ["The selected produit id is invalid."]
     *   }
     * }
     * @response 401 {
     *   "message": "Unauthenticated."
     * }
     * @response 404 {
     *   "message": "Not found."
     * }
     */

    public function store(Request $request)
    {
        $request->validate([
            'produitId' => 'required|exists:products,produitId',
            'quantite' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->produitId);
        if ($product->stock < $request->quantite) {
            return response()->json(['message' => 'Not enough stock'], 400);
        }

        $panier = Panier::create([
            'userId' => $request->user()->userId,
            'produitId' => $request->produitId,
            'quantite' => $request->quantite,
        ]);

        return response()->json($panier->load('product'), 201);
    }
















    /**
     * Mettre à jour un article du panier
     *
     * Met à jour la quantité d'un article existant dans le panier. Accessible uniquement au propriétaire du panier.
     *
     * @group Gestion du Panier
     * @authenticated
     * @bodyParam quantite integer required La nouvelle quantité du produit (minimum 1). Example: 3
     * @response 200 {
     *   "id": 1,
     *   "userId": 1,
     *   "produitId": 1,
     *   "quantite": 3,
     *   "created_at": "2025-05-19T18:10:00+01:00",
     *   "updated_at": "2025-05-19T18:11:00+01:00",
     *   "product": {
     *     "produitId": 1,
     *     "nom": "Laptop",
     *     "prix": 749.99,
     *     "stock": 10
     *   }
     * }
     * @response 400 {
     *   "message": "Not enough stock"
     * }
     * @response 422 {
     *   "errors": {
     *     "quantite": ["The quantite must be an integer."]
     *   }
     * }
     * @response 401 {
     *   "message": "Unauthenticated."
     * }
     * @response 403 {
     *   "message": "Unauthorized."
     * }
     * @response 404 {
     *   "message": "Not found."
     * }
     */
    public function update(Request $request, Panier $panier)
    {
        $this->authorize('update', $panier);

        $request->validate([
            'quantite' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($panier->produitId);
        if ($product->stock < $request->quantite) {
            return response()->json(['message' => 'Not enough stock'], 400);
        }

        $panier->update(['quantite' => $request->quantite]);
        return response()->json($panier->load('product'));
    }













    /**
     * Supprimer un article du panier
     *
     * Supprime un article du panier. Accessible uniquement au propriétaire du panier.
     *
     * @group Gestion du Panier
     * @authenticated
     * @response 204 {}
     * @response 401 {
     *   "message": "Unauthenticated."
     * }
     * @response 403 {
     *   "message": "Unauthorized."
     * }
     * @response 404 {
     *   "message": "Not found."
     * }
     */
    public function destroy(Panier $panier)
    {
        $this->authorize('delete', $panier);

        $panier->delete();
        return response()->json(null, 204);
    }
}
