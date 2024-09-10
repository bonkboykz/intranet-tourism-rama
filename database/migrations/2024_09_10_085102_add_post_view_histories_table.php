<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('post_view_histories', function (Blueprint $table) {
            $table->id();
            $table->uuid('post_id'); // Reference to the post
            $table->bigInteger('user_id'); // Reference to the user
            $table->timestamp('viewed_at')->useCurrent(); // Time the post was viewed
            $table->timestamps();

            // Foreign keys
            $table->foreign('post_id')->references('id')->on('posts')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            // Optional: Ensure a user can only have one view per post
            $table->unique(['post_id', 'user_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('post_view_histories');
    }
}
;
