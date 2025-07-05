<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Commentaire;
use Illuminate\Http\Request;

class CommentaireController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->only(['store', 'update', 'destroy']);
    }






    /**
     * List all comments
     *
     * Retrieves a list of all comments, including their associated user and product details.
     *
     * @group Comment Management
     * @response 200 [
     *   {
     *     "id": 1,
     *     "userId": 1,
     *     "produitId": 1,
     *     "content": "Great product, highly recommend!",
     *     "rating": 5,
     *     "created_at": "2025-05-19T18:02:00+01:00",
     *     "updated_at": "2025-05-19T18:02:00+01:00",
     *     "utilisateur": {
     *       "userId": 1,
     *       "username": "johndoe",
     *       "email": "john@example.com"
     *     },
     *     "product": {
     *       "produitId": 1,
     *       "nom": "Laptop",
     *       "prix": 749.99
     *     }
     *   }
     * ]
     */

    public function index()
    {
        return Commentaire::with(['utilisateur', 'product'])->get();
    }










    /**
     * Create a new comment
     *
     * Stores a new comment for a product by the authenticated user.
     *
     * @group Comment Management
     * @authenticated
     * @bodyParam produitId integer required The ID of the product being commented on. Example: 1
     * @bodyParam content string required The content of the comment. Example: Great product, highly recommend!
     * @bodyParam rating integer optional The rating for the product (1 to 5). Example: 5
     * @response 201 {
     *   "id": 1,
     *   "userId": 1,
     *   "produitId": 1,
     *   "content": "Great product, highly recommend!",
     *   "rating": 5,
     *   "created_at": "2025-05-19T18:02:00+01:00",
     *   "updated_at": "2025-05-19T18:02:00+01:00",
     *   "utilisateur": {
     *     "userId": 1,
     *     "username": "johndoe",
     *     "email": "john@example.com"
     *   },
     *   "product": {
     *     "produitId": 1,
     *     "nom": "Laptop",
     *     "prix": 749.99
     *   }
     * }
     * @response 422 {
     *   "errors": {
     *     "produitId": ["The selected produit id is invalid."]
     *   }
     * }
     * @response 401 {
     *   "message": "Unauthenticated."
     * }
     */
    public function store(Request $request)
    {
        $request->validate([
            'produitId' => 'required|exists:products,produitId',
            'content' => 'required|string',
            'rating' => 'nullable|integer|between:1,5',
        ]);

        $commentaire = Commentaire::create([
            'userId' => $request->user()->userId,
            'produitId' => $request->produitId,
            'content' => $request->content,
            'rating' => $request->rating,
        ]);

        return response()->json($commentaire->load(['utilisateur', 'product']), 201);
    }








    /**
     * Get a specific comment
     *
     * Retrieves the details of a comment by its ID, including its associated user and product.
     *
     * @group Comment Management
     * @response 200 {
     *   "id": 1,
     *   "userId": 1,
     *   "produitId": 1,
     *   "content": "Great product, highly recommend!",
     *   "rating": 5,
     *   "created_at": "2025-05-19T18:02:00+01:00",
     *   "updated_at": "2025-05-19T18:02:00+01:00",
     *   "utilisateur": {
     *     "userId": 1,
     *     "username": "johndoe",
     *     "email": "john@example.com"
     *   },
     *   "product": {
     *     "produitId": 1,
     *     "nom": "Laptop",
     *     "prix": 749.99
     *   }
     * }
     * @response 404 {
     *   "message": "Not found."
     * }
     */

    public function show(Commentaire $commentaire)
    {
        return $commentaire->load(['utilisateur', 'product']);
    }









    /**
     * Update a comment
     *
     * Updates the content or rating of an existing comment by its ID. Only accessible to the comment's owner.
     *
     * @group Comment Management
     * @authenticated
     * @bodyParam content string required The updated content of the comment. Example: Updated: Really great product!
     * @bodyParam rating integer optional The updated rating for the product (1 to 5). Example: 4
     * @response 200 {
     *   "id": 1,
     *   "userId": 1,
     *   "produitId": 1,
     *   "content": "Updated: Really great product!",
     *   "rating": 4,
     *   "created_at": "2025-05-19T18:02:00+01:00",
     *   "updated_at": "2025-05-19T18:03:00+01:00",
     *   "utilisateur": {
     *     "userId": 1,
     *     "username": "johndoe",
     *     "email": "john@example.com"
     *   },
     *   "product": {
     *     "produitId": 1,
     *     "nom": "Laptop",
     *     "prix": 749.99
     *   }
     * }
     * @response 422 {
     *   "errors": {
     *     "content": ["The content field is required."]
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

    public function update(Request $request, Commentaire $commentaire)
    {
        // only the authorize user can update 
        $this->authorize('update', $commentaire);

        $request->validate([
            'content' => 'required|string',
            'rating' => 'nullable|integer|between:1,5',
        ]);

        $commentaire->update($request->only(['content', 'rating']));
        return response()->json($commentaire->load(['utilisateur', 'product']));
    }













    /**
     * Delete a comment
     *
     * Removes a comment from the database by its ID. Only accessible to the comment's owner.
     *
     * @group Comment Management
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

    public function destroy(Commentaire $commentaire)
    {
        // only the authorize user can delete
        $this->authorize('delete', $commentaire);

        $commentaire->delete();
        return response()->json(null, 204);
    }
}
