<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{

    /**
     * List all products
     *
     * Retrieves a paginated list of products with optional filtering by category, price, type, or search term, and sorting by various fields.
     *
     * @group Product Management
     * @queryParam per_page integer Optional. Number of products per page (1-100). Example: 50
     * @queryParam page integer Optional. Page number for pagination. Example: 1
     * @queryParam sort_by string Optional. Field to sort by (nom, prix, stock, created_at, updated_at). Example: prix
     * @queryParam sort_dir string Optional. Sort direction (asc, desc). Example: asc
     * @queryParam category_id integer Optional. Filter by category ID. Example: 1
     * @queryParam search string Optional. Search by product name or description. Example: laptop
     * @queryParam min_price numeric Optional. Minimum price filter. Example: 100
     * @queryParam max_price numeric Optional. Maximum price filter. Example: 1000
     * @queryParam type string Optional. Filter by product type. Example: electronics
     * @response 200 {
     *   "data": [
     *     {
     *       "id": 1,
     *       "nom": "Laptop",
     *       "description": "High-performance laptop",
     *       "prix": 999.99,
     *       "stock": 10,
     *       "categoryId": 1,
     *       "type": "electronics",
     *       "size": null,
     *       "imageUrl": "http://your-app-url/storage/products/laptop.jpg",
     *       "category": {
     *         "categoryId": 1,
     *         "name": "Electronics"
     *       }
     *     }
     *   ],
     *   "meta": {
     *     "current_page": 1,
     *     "per_page": 50,
     *     "total": 100,
     *     "last_page": 2,
     *     "sort_by": "created_at",
     *     "sort_dir": "desc",
     *     "filters": {
     *       "category_id": 1,
     *       "search": "laptop",
     *       "min_price": 100,
     *       "max_price": 1000,
     *       "type": "electronics"
     *     }
     *   },
     *   "links": {
     *     "first": "http://your-app-url/api/products?page=1",
     *     "last": "http://your-app-url/api/products?page=2",
     *     "prev": null,
     *     "next": "http://your-app-url/api/products?page=2"
     *   }
     * }
     * @response 422 {
     *   "errors": {
     *     "per_page": ["The per_page must be an integer."]
     *   }
     * }
     */


    public function index(Request $request)
    {
        // validate the request fields 
        $validator = Validator::make($request->all(), [
            'per_page' => 'sometimes|integer|min:1|max:100',
            'page' => 'sometimes|integer|min:1',
            'sort_by' => 'sometimes|string|in:nom,prix,stock,created_at,updated_at',
            'sort_dir' => 'sometimes|string|in:asc,desc',
            'category_id' => 'sometimes|exists:categories,categoryId',
            'search' => 'sometimes|string|max:255',
            'min_price' => 'sometimes|numeric|min:0',
            'max_price' => 'sometimes|numeric|min:0',
            'type' => 'sometimes|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // adding a limit to products per page 
        $perPage = min($request->input('per_page', 50), 100);


        $query = Product::with('category');

        // get the category needed
        if ($request->has('category_id')) {
            $query->where('categoryId', $request->input('category_id'));
        }


        // search by name or description 
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('nom', 'like', '%' . $searchTerm . '%')
                    ->orWhere('description', 'like', '%' . $searchTerm . '%');
            });
        }


        // filtering by price , type , date 
        if ($request->has('min_price')) {
            $query->where('prix', '>=', $request->input('min_price'));
        }

        if ($request->has('max_price')) {
            $query->where('prix', '<=', $request->input('max_price'));
        }



        if ($request->has('type')) {
            $query->where('type', 'like', '%' . $request->input('type') . '%');
        }


        $sortBy = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_dir', 'desc');
        $query->orderBy($sortBy, $sortDirection);

        // paginate the products
        $products = $query->paginate($perPage);


        $products->getCollection()->transform(function ($product) {
            if ($product->imageUrl) {
                //get the image path and make it accessible 
                $product->imageUrl = Storage::url($product->imageUrl);
            }
            return $product;
        });


        // return an organized json object for proper pagination 
        return response()->json([
            'data' => $products->items(),
            'meta' => [
                'current_page' => $products->currentPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
                'last_page' => $products->lastPage(),
                'sort_by' => $sortBy,
                'sort_dir' => $sortDirection,
                'filters' => $request->only(['category_id', 'search', 'min_price', 'max_price',  'type'])
            ],

            // pagination Links 
            'links' => [
                'first' => $products->url(1),
                'last' => $products->url($products->lastPage()),
                'prev' => $products->previousPageUrl(),
                'next' => $products->nextPageUrl(),
            ]
        ]);
    }






    /**
     * Create a new product
     *
     * Stores a new product in the database. Only accessible to authorized users (admins).
     *
     * @group Product Management
     * @authenticated
     * @bodyParam nom string required The name of the product. Example: Laptop
     * @bodyParam description string optional The description of the product. Example: High-performance laptop
     * @bodyParam prix numeric required The price of the product. Example: 999.99
     * @bodyParam stock integer required The stock quantity. Example: 10
     * @bodyParam categoryId integer required The ID of the category. Example: 1
     * @bodyParam type string optional The type of the product. Example: electronics
     * @bodyParam size string optional The size of the product. Example: medium
     * @bodyParam image file optional The product image (jpeg, png, jpg, gif, max 2MB). Example: laptop.jpg
     * @response 201 {
     *   "id": 1,
     *   "nom": "Laptop",
     *   "description": "High-performance laptop",
     *   "prix": 999.99,
     *   "stock": 10,
     *   "categoryId": 1,
     *   "type": "electronics",
     *   "size": "medium",
     *   "imageUrl": "http://your-app-url/storage/products/laptop.jpg"
     * }
     * @response 422 {
     *   "errors": {
     *     "nom": ["The nom field is required."]
     *   }
     * }
     * @response 401 {
     *   "message": "Unauthenticated."
     * }
     * @response 403 {
     *   "message": "Unauthorized."
     * }
     */




    public function store(Request $request)
    {
        // only authorized users can store (admins)
        $this->authorize('create', Product::class);
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'prix' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'categoryId' => 'required|exists:categories,categoryId',
            'type' => 'nullable|string',
            'size' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:1048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {

            $imagePath = $request->file('image')->store('products', 'public');
        }

        $product = Product::create([
            'nom' => $validated['nom'],
            'description' => $validated['description'],
            'prix' => $validated['prix'],
            'stock' => $validated['stock'],
            'categoryId' => $validated['categoryId'],
            'type' => $validated['type'],
            'size' => $validated['size'] ?? null,
            'imageUrl' => $imagePath,
        ]);

        if ($product->imageUrl) {
            $product->imageUrl = Storage::url($product->imageUrl);
        }

        return response()->json($product, 201);
    }







    /**
     * Get a specific product
     *
     * Retrieves the details of a product by its ID, including its category.
     *
     * @group Product Management
     * @response 200 {
     *   "id": 1,
     *   "nom": "Laptop",
     *   "description": "High-performance laptop",
     *   "prix": 999.99,
     *   "stock": 10,
     *   "categoryId": 1,
     *   "type": "electronics",
     *   "size": "medium",
     *   "imageUrl": "http://your-app-url/storage/products/laptop.jpg",
     *   "category": {
     *     "categoryId": 1,
     *     "name": "Electronics"
     *   }
     * }
     * @response 404 {
     *   "message": "Not found."
     * }
     */

    public function show($id)
    {
        $product = Product::with('category')->findOrFail($id);
        if ($product->imageUrl) {
            $product->imageUrl = Storage::url($product->imageUrl);
        }
        return $product;
    }








    /**
     * Update a product
     *
     * Updates the details of an existing product by its ID. Only accessible to authorized users (admins).
     *
     * @group Product Management
     * @authenticated
     * @bodyParam nom string optional The name of the product. Example: Updated Laptop
     * @bodyParam description string optional The description of the product. Example: Updated description
     * @bodyParam prix numeric optional The price of the product. Example: 1099.99
     * @bodyParam stock integer optional The stock quantity. Example: 15
     * @bodyParam categoryId integer optional The ID of the category. Example: 2
     * @bodyParam brand string optional The brand of the product. Example: Dell
     * @bodyParam type string optional The type of the product. Example: electronics
     * @bodyParam size string optional The size of the product. Example: large
     * @bodyParam color string optional The color of the product. Example: black
     * @bodyParam image file optional The product image (jpeg, png, jpg, gif, max 2MB). Example: updated_laptop.jpg
     * @response 200 {
     *   "id": 1,
     *   "nom": "Updated Laptop",
     *   "description": "Updated description",
     *   "prix": 1099.99,
     *   "stock": 15,
     *   "categoryId": 2,
     *   "brand": "Dell",
     *   "type": "electronics",
     *   "size": "large",
     *   "color": "black",
     *   "imageUrl": "http://your-app-url/storage/products/updated_laptop.jpg"
     * }
     * @response 422 {
     *   "errors": {
     *     "prix": ["The prix must be a number."]
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
    public function update(Request $request, string $id)
    {

        $product = Product::findOrFail($id);
        $this->authorize('update', $product);

        \Log::info('Update Product Request:', [
            'id' => $id,
            'request_data' => $request->all(),
            'files' => $request->hasFile('image') ? 'Image present' : 'No image',
        ]);


        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'prix' => 'sometimes|required|numeric|min:0',
            'stock' => 'sometimes|required|integer|min:0',
            'categoryId' => 'sometimes|required|exists:categories,categoryId',
            'brand' => 'sometimes|nullable|string',
            'type' => 'sometimes|nullable|string',
            'image' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,webp,gif|max:1048',
        ]);


        $updateData = [];

        if ($request->has('nom')) {
            $updateData['nom'] = $validated['nom'];
        }
        if ($request->has('description')) {
            $updateData['description'] = $validated['description'];
        }
        if ($request->has('prix')) {
            $updateData['prix'] = $validated['prix'];
        }
        if ($request->has('stock')) {
            $updateData['stock'] = $validated['stock'];
        }
        if ($request->has('categoryId')) {
            $updateData['categoryId'] = $validated['categoryId'];
        }

        if ($request->has('type')) {
            $updateData['type'] = $validated['type'];
        }
        if ($request->has('size')) {
            $updateData['size'] = $validated['size'] ?? null;
        }



        if ($request->hasFile('image')) {
            \Log::info('New image uploaded for product:', ['product_id' => $id]);

            if ($product->imageUrl && Storage::disk('public')->exists($product->imageUrl)) {
                \Log::info('Deleting old image:', ['image_path' => $product->imageUrl]);
                Storage::disk('public')->delete($product->imageUrl);
            }

            $imagePath = $request->file('image')->store('products', 'public');
            $updateData['imageUrl'] = $imagePath;
            \Log::info('New image stored:', ['new_image_path' => $imagePath]);
        } else {
            \Log::info('No new image uploaded, keeping existing image:', ['imageUrl' => $product->imageUrl]);
        }


        \Log::info('Updating product with data:', $updateData);
        $product->update($updateData);


        if ($product->imageUrl) {
            $product->imageUrl = Storage::url($product->imageUrl);
        }

        \Log::info('Product updated successfully:', $product->toArray());

        return response()->json($product, 200);
    }






    /**
     * Delete a product
     *
     * Removes a product from the database by its ID. Only accessible to authorized users (admins).
     *
     * @group Product Management
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
    public function destroy($id)
    {

        $product = Product::findOrFail($id);
        $this->authorize('delete', $product);
        if ($product->imageUrl) {
            Storage::disk('public')->delete($product->imageUrl);
        }
        $product->delete();
        return response()->json(null, 204);
    }
}
