<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\OrderItem;
use App\Models\Panier;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommandeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * List all orders for the authenticated user
     *
     * Retrieves a list of all orders belonging to the authenticated user, including their order items and associated products.
     *
     * @group Order Management
     * @authenticated
     * @response 200 [
     *   {
     *     "commandeId": 1,
     *     "userId": 1,
     *     "totalPrix": 1499.98,
     *     "stat": "pending",
     *     "created_at": "2025-05-19T18:00:00+01:00",
     *     "updated_at": "2025-05-19T18:00:00+01:00",
     *     "orderItems": [
     *       {
     *         "commandeId": 1,
     *         "produitId": 1,
     *         "quantite": 2,
     *         "prix": 749.99,
     *         "created_at": "2025-05-19T18:00:00+01:00",
     *         "updated_at": "2025-05-19T18:00:00+01:00",
     *         "product": {
     *           "id": 1,
     *           "nom": "Laptop",
     *           "prix": 749.99,
     *           "stock": 8
     *         }
     *       }
     *     ]
     *   }
     * ]
     * @response 401 {
     *   "message": "Unauthenticated."
     * }
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            return Commande::with('orderItems.product')->get();
        }

        return $user->commandes()->with('orderItems.product')->get();
    }

    /**
     * Create a new order
     *
     * Creates an order from the authenticated user's cart items, including order items for each product, updates product stock, and clears the cart.
     *
     * @group Order Management
     * @authenticated
     * @response 201 {
     *   "commandeId": 1,
     *   "userId": 1,
     *   "totalPrix": 1499.98,
     *   "stat": "pending",
     *   "created_at": "2025-05-19T18:00:00+01:00",
     *   "updated_at": "2025-05-19T18:00:00+01:00",
     *   "orderItems": [
     *     {
     *       "commandeId": 1,
     *       "produitId": 1,
     *       "quantite": 2,
     *       "prix": 749.99,
     *       "created_at": "2025-05-19T18:00:00+01:00",
     *       "updated_at": "2025-05-19T18:00:00+01:00",
     *       "product": {
     *         "id": 1,
     *         "nom": "Laptop",
     *         "prix": 749.99,
     *         "stock": 8
     *       }
     *     }
     *   ]
     * }
     * @response 400 {
     *   "message": "Cart is empty"
     * }
     * @response 401 {
     *   "message": "Unauthenticated."
     * }
     * @response 500 {
     *   "message": "Order creation failed"
     * }
     */
    public function store(Request $request)
    {
        $user = $request->user();
        $cartItems = $user->paniers()->with('product')->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        $totalPrix = $cartItems->sum(function ($item) {
            return $item->quantite * $item->product->prix;
        });

        DB::beginTransaction();
        try {
            $commande = Commande::create([
                'userId' => $user->userId,
                'totalPrix' => $totalPrix,
                'stat' => 'pending',
            ]);

            foreach ($cartItems as $item) {
                OrderItem::create([
                    'commandeId' => $commande->commandeId,
                    'produitId' => $item->produitId,
                    'quantite' => $item->quantite,
                    'prix' => $item->product->prix,
                ]);

                $product = Product::find($item->produitId);
                $product->stock -= $item->quantite;
                $product->save();
            }

            $user->paniers()->delete();
            DB::commit();

            return response()->json($commande->load('orderItems.product'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Order creation failed'], 500);
        }
    }

    /**
     * Get a specific order
     *
     * Retrieves the details of an order by its ID, including its order items and associated products. Only accessible to the order's owner.
     *
     * @group Order Management
     * @authenticated
     * @response 200 {
     *   "commandeId": 1,
     *   "userId": 1,
     *   "totalPrix": 1499.98,
     *   "stat": "pending",
     *   "created_at": "2025-05-19T18:00:00+01:00",
     *   "updated_at": "2025-05-19T18:00:00+01:00",
     *   "orderItems": [
     *     {
     *       "commandeId": 1,
     *       "produitId": 1,
     *       "quantite": 2,
     *       "prix": 749.99,
     *       "created_at": "2025-05-19T18:00:00+01:00",
     *       "updated_at": "2025-05-19T18:00:00+01:00",
     *       "product": {
     *         "id": 1,
     *         "nom": "Laptop",
     *         "prix": 749.99,
     *         "stock": 8
     *       }
     *     }
     *   ]
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
    public function show(Commande $commande)
    {
        $this->authorize('view', $commande);
        return $commande->load('orderItems.product');
    }

    /**
     * Update the status of an order
     *
     * Allows an admin to update the status of an order (e.g., to mark it as delivered). The status must be one of: pending, processing, shipped, delivered, canceled.
     *
     * @group Order Management
     * @authenticated
     * @bodyParam stat string required The new status of the order. Must be one of: pending, processing, shipped, delivered, canceled. Example: delivered
     * @response 200 {
     *   "commandeId": 1,
     *   "userId": 1,
     *   "totalPrix": 1499.98,
     *   "stat": "delivered",
     *   "created_at": "2025-05-19T18:00:00+01:00",
     *   "updated_at": "2025-05-19T18:30:00+01:00",
     *   "orderItems": [
     *     {
     *       "commandeId": 1,
     *       "produitId": 1,
     *       "quantite": 2,
     *       "prix": 749.99,
     *       "created_at": "2025-05-19T18:00:00+01:00",
     *       "updated_at": "2025-05-19T18:00:00+01:00",
     *       "product": {
     *         "id": 1,
     *         "nom": "Laptop",
     *         "prix": 749.99,
     *         "stock": 8
     *       }
     *     }
     *   ]
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
     * @response 422 {
     *   "message": "The stat field is required.",
     *   "errors": {
     *     "stat": ["The stat field is required."]
     *   }
     * }
     */
    public function update(Request $request, Commande $commande)
    {
        // Authorize: Only admins can update order status
        $this->authorize('update', $commande);

        // Validate the status
        $validated = $request->validate([
            'stat' => 'required|in:pending,processing,shipped,delivered,canceled',
        ]);

        // Update the order status
        $commande->stat = $validated['stat'];
        $commande->save();

        // Return the updated order with related data
        return response()->json($commande->load('orderItems.product'), 200);
    }
}
