<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{


    /**
     * List all categories
     *
     * Retrieves a list of all categories.
     *
     * @group Category Management
     * @response 200 [
     *   {
     *     "categoryId": 1,
     *     "name": "Electronics",
     *     "created_at": "2025-05-19T17:58:00+01:00",
     *     "updated_at": "2025-05-19T17:58:00+01:00"
     *   },
     *   {
     *     "categoryId": 2,
     *     "name": "Clothing",
     *     "created_at": "2025-05-19T17:58:00+01:00",
     *     "updated_at": "2025-05-19T17:58:00+01:00"
     *   }
     * ]
     */
    public function index()
    {
        return Category::all();
    }







    /**
     * Create a new category
     *
     * Stores a new category in the database.
     *
     * @group Category Management
     * @bodyParam name string required The name of the category (max 50 characters). Example: Electronics
     * @response 201 {
     *   "categoryId": 1,
     *   "name": "Electronics",
     *   "created_at": "2025-05-19T17:58:00+01:00",
     *   "updated_at": "2025-05-19T17:58:00+01:00"
     * }
     * @response 422 {
     *   "errors": {
     *     "name": ["The name field is required."]
     *   }
     * }
     */

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:50',
        ]);

        $category = Category::create($request->all());
        return response()->json($category, 201);
    }









    /**
     * Get a specific category
     *
     * Retrieves the details of a category by its ID.
     *
     * @group Category Management
     * @response 200 {
     *   "categoryId": 1,
     *   "name": "Electronics",
     *   "created_at": "2025-05-19T17:58:00+01:00",
     *   "updated_at": "2025-05-19T17:58:00+01:00"
     * }
     * @response 404 {
     *   "message": "Not found."
     * }
     */
    public function show(Category $category)
    {
        return $category;
    }







    /**
     * Update a category
     *
     * Updates the details of an existing category by its ID.
     *
     * @group Category Management
     * @bodyParam name string required The name of the category (max 50 characters). Example: Updated Electronics
     * @response 200 {
     *   "categoryId": 1,
     *   "name": "Updated Electronics",
     *   "created_at": "2025-05-19T17:58:00+01:00",
     *   "updated_at": "2025-05-19T17:59:00+01:00"
     * }
     * @response 422 {
     *   "errors": {
     *     "name": ["The name field is required."]
     *   }
     * }
     * @response 404 {
     *   "message": "Not found."
     * }
     */
    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'required|string|max:50',
        ]);

        $category->update($request->all());
        return response()->json($category);
    }









    /**
     * Delete a category
     *
     * Removes a category from the database by its ID.
     *
     * @group Category Management
     * @response 204 {}
     * @response 404 {
     *   "message": "Not found."
     * }
     */


    public function destroy(Category $category)
    {
        $category->delete();
        return response()->json(null, 204);
    }
}
