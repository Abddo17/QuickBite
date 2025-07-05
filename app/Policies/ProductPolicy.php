<?php

namespace App\Policies;

use App\Models\Utilisateur;
use App\Models\Product;

class ProductPolicy
{


     public function create(Utilisateur $user)
     {

          return $user->role === 'admin';
     }

     public function update(Utilisateur $user, Product $product)
     {
          return $user->role === 'admin';
     }


     public function delete(Utilisateur $user, Product $product)
     {
          return $user->role === 'admin';
     }
}
