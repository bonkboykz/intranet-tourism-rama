<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRequestsTable extends Migration
{
    public function up()
    {
        Schema::create('requests', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->bigInteger('user_id'); // The user who made the request
            $table->string('request_type'); // Type of request (e.g., 'join_group', 'profile_change')
            $table->json('details')->nullable(); // Additional data related to the request
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending'); // Request status
            $table->timestamp('action_at')->nullable(); // When the request was acted on (approved/rejected)
            $table->timestamps();

            // Foreign key to users table
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('requests');
    }
}
