<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id('orderItemId');
            $table->foreignId('commandeId')->constrained('commandes', 'commandeId')->onDelete('cascade');
            $table->foreignId('produitId')->constrained('products', 'produitId')->onDelete('cascade');
            $table->integer('quantite');
            $table->decimal('prix', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
