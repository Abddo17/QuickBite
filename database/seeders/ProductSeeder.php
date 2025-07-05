<?php
namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class ProductSeeder extends Seeder
{
    public function run()
    {
        
        $products = [
            // Pizzas (categoryId: 1)
            [
                'produitId' => 1,
                'nom' => 'Margherita Pizza',
                'description' => 'Classic pizza with tomato sauce, fresh mozzarella, and basil.',
                'prix' => 12.99,
                'stock' => 50,
                'image' => 'pizza1.jpg',
                'categoryId' => 1,
                'type' => 'Vegetarian',
                'size' => 'Medium',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'produitId' => 2,
                'nom' => 'Pepperoni Pizza',
                'description' => 'Spicy pepperoni slices with mozzarella and tomato sauce.',
                'prix' => 14.99,
                'stock' => 40,
                'image' => 'pizza2.jpg',
                'categoryId' => 1,
                'type' => 'Non-Vegetarian',
                'size' => 'Large',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'produitId' => 3,
                'nom' => 'Veggie Supreme Pizza',
                'description' => 'Loaded with bell peppers, onions, mushrooms, and olives.',
                'prix' => 13.49,
                'stock' => 45,
                'image' => 'pizza3.jpg',
                'categoryId' => 1,
                'type' => 'Vegetarian',
                'size' => 'Medium',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'produitId' => 4,
                'nom' => 'BBQ Chicken Pizza',
                'description' => 'Grilled chicken with BBQ sauce, red onions, and cilantro.',
                'prix' => 15.49,
                'stock' => 35,
                'image' => 'pizza4.jpg',
                'categoryId' => 1,
                'type' => 'Non-Vegetarian',
                'size' => 'Large',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Salads (categoryId: 2)
            [
                'produitId' => 5,
                'nom' => 'Caesar Salad',
                'description' => 'Romaine lettuce with Caesar dressing, croutons, and parmesan.',
                'prix' => 8.99,
                'stock' => 30,
                'image' => 'salad1.jpg',
                'categoryId' => 2,
                'type' => 'Vegetarian',
                'size' => 'Regular',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'produitId' => 6,
                'nom' => 'Greek Salad',
                'description' => 'Cucumbers, tomatoes, feta, olives, and oregano dressing.',
                'prix' => 9.49,
                'stock' => 25,
                'image' => 'salad2.jpg',
                'categoryId' => 2,
                'type' => 'Vegetarian',
                'size' => 'Regular',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'produitId' => 7,
                'nom' => 'Chicken Cobb Salad',
                'description' => 'Grilled chicken, bacon, avocado, eggs, and blue cheese.',
                'prix' => 11.99,
                'stock' => 20,
                'image' => 'salad3.jpg',
                'categoryId' => 2,
                'type' => 'Non-Vegetarian',
                'size' => 'Large',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'produitId' => 8,
                'nom' => 'Caprese Salad',
                'description' => 'Fresh mozzarella, tomatoes, basil, and balsamic glaze.',
                'prix' => 9.99,
                'stock' => 25,
                'image' => 'salad4.jpg',
                'categoryId' => 2,
                'type' => 'Vegetarian',
                'size' => 'Regular',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Sandwiches (categoryId: 3)
            [
                'produitId' => 9,
                'nom' => 'Grilled Chicken Sandwich',
                'description' => 'Grilled chicken breast with lettuce, tomato, and mayo.',
                'prix' => 10.99,
                'stock' => 30,
                'image' => 'sandwich1.jpg',
                'categoryId' => 3,
                'type' => 'Non-Vegetarian',
                'size' => 'Regular',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'produitId' => 10,
                'nom' => 'Turkey Club Sandwich',
                'description' => 'Sliced turkey, bacon, lettuce, tomato, and mayo on toast.',
                'prix' => 11.49,
                'stock' => 25,
                'image' => 'sandwich2.jpg',
                'categoryId' => 3,
                'type' => 'Non-Vegetarian',
                'size' => 'Regular',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'produitId' => 11,
                'nom' => 'Veggie Panini',
                'description' => 'Grilled zucchini, peppers, and mozzarella with pesto.',
                'prix' => 9.99,
                'stock' => 20,
                'image' => 'sandwich3.jpg',
                'categoryId' => 3,
                'type' => 'Vegetarian',
                'size' => 'Regular',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'produitId' => 12,
                'nom' => 'Philly Cheesesteak',
                'description' => 'Thinly sliced beef, melted cheese, onions, and peppers.',
                'prix' => 12.49,
                'stock' => 20,
                'image' => 'sandwich4.jpg',
                'categoryId' => 3,
                'type' => 'Non-Vegetarian',
                'size' => 'Regular',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Pasta (categoryId: 4)
            [
                'produitId' => 13,
                'nom' => 'Spaghetti Bolognese',
                'description' => 'Pasta with rich meat sauce and parmesan cheese.',
                'prix' => 13.49,
                'stock' => 30,
                'image' => 'pasta1.jpg',
                'categoryId' => 4,
                'type' => 'Non-Vegetarian',
                'size' => 'Regular',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'produitId' => 14,
                'nom' => 'Pesto Pasta',
                'description' => 'Penne with basil pesto and cherry tomatoes.',
                'prix' => 12.99,
                'stock' => 25,
                'image' => 'pasta2.jpg',
                'categoryId' => 4,
                'type' => 'Vegetarian',
                'size' => 'Regular',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'produitId' => 15,
                'nom' => 'Chicken Alfredo',
                'description' => 'Fettuccine in creamy Alfredo sauce with grilled chicken.',
                'prix' => 14.99,
                'stock' => 20,
                'image' => 'pasta3.jpg',
                'categoryId' => 4,
                'type' => 'Non-Vegetarian',
                'size' => 'Regular',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'produitId' => 16,
                'nom' => 'Mushroom Carbonara',
                'description' => 'Spaghetti with creamy egg sauce and sautéed mushrooms.',
                'prix' => 13.99,
                'stock' => 25,
                'image' => 'pasta4.jpg',
                'categoryId' => 4,
                'type' => 'Vegetarian',
                'size' => 'Regular',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Burgers (categoryId: 5)
            [
                'produitId' => 17,
                'nom' => 'Classic Beef Burger',
                'description' => 'Beef patty with cheddar, lettuce, tomato, and special sauce.',
                'prix' => 12.49,
                'stock' => 30,
                'image' => 'burger1.jpg',
                'categoryId' => 5,
                'type' => 'Non-Vegetarian',
                'size' => 'Regular',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'produitId' => 18,
                'nom' => 'Veggie Burger',
                'description' => 'Plant-based patty with avocado, lettuce, and vegan mayo.',
                'prix' => 11.49,
                'stock' => 25,
                'image' => 'burger2.jpg',
                'categoryId' => 5,
                'type' => 'Vegetarian',
                'size' => 'Regular',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'produitId' => 19,
                'nom' => 'Bacon Cheeseburger',
                'description' => 'Beef patty with crispy bacon, cheddar, and BBQ sauce.',
                'prix' => 13.99,
                'stock' => 20,
                'image' => 'burger3.jpg',
                'categoryId' => 5,
                'type' => 'Non-Vegetarian',
                'size' => 'Regular',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'produitId' => 20,
                'nom' => 'Spicy Chicken Burger',
                'description' => 'Crispy chicken patty with spicy mayo and pickles.',
                'prix' => 12.99,
                'stock' => 25,
                'image' => 'burger4.jpg',
                'categoryId' => 5,
                'type' => 'Non-Vegetarian',
                'size' => 'Regular',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        
        foreach ($products as $index => $productData) {
            $imageName = $productData['image'];
            $sourcePath = public_path('seeder-images/' . $imageName);
            $destinationPath = 'products/' . str_replace('.jpg', '', $imageName) . '-' . time() . '-' . ($index + 1) . '.jpg';

          
            unset($productData['image']);

            
            if (File::exists($sourcePath)) {
                
                Storage::disk('public')->put($destinationPath, File::get($sourcePath));
                $productData['imageUrl'] = $destinationPath;
            } else {
                
                $productData['imageUrl'] = null;
            }

          
            Product::create($productData);
        }
    }
}
