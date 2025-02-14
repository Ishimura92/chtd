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
        Schema::create('gift_ideas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('url');
            $table->string('image_url')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->text('description')->nullable();
            
            // Pola dla odbiorcy
            $table->enum('recipient_type', ['CUSTOM', 'USER']);
            $table->foreignId('recipient_user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('recipient_custom')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gift_ideas');
    }
};
