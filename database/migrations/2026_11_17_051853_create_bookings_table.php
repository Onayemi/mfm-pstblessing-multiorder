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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_code')->unique();
            $table->string('customer_name');
            $table->string('phone_number')->nullable();
            $table->json('attendees');
            // $table->enum('group_type', ['adult', 'teenage', 'children']);
            // $table->decimal('base_price', 10, 2);
            // $table->boolean('play_game')->default(false);
            // $table->decimal('game_price', 10, 2)->default(0);
            $table->decimal('total_price', 10, 2);
            $table->dateTime('booked_at');
            $table->foreignId('processed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
