<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', [
                'friend_request',
                'friend_accepted',
                'gift_reserved',
                'friend_rejected'
            ]);
            $table->json('data');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            // Indeks dla szybszego wyszukiwania nieprzeczytanych powiadomień
            $table->index(['user_id', 'read_at']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('notifications');
    }
}; 