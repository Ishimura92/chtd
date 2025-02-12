<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('gift_reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gift_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            // Zapewniamy, że jeden prezent może być zarezerwowany tylko raz
            $table->unique('gift_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('gift_reservations');
    }
}; 