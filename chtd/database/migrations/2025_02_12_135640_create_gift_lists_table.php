<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('gift_lists', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->boolean('is_public')->default(false);
            $table->enum('owner_type', ['user', 'child']);
            $table->unsignedBigInteger('owner_id');
            $table->timestamps();

            $table->index(['owner_type', 'owner_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('gift_lists');
    }
}; 