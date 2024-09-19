<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table("feedbacks", function (Blueprint $table) {
            $table->dropForeign("feedbacks_user_id_foreign");
            $table->foreign("user_id")->references("id")->on("users")->onDelete("cascade");

            // delete feedback if poll is deleted
            $table->dropForeign("feedbacks_poll_id_foreign");
            $table->foreign("poll_id")->references("id")->on("polls")->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table("feedbacks", function (Blueprint $table) {
            $table->dropForeign("feedbacks_user_id_foreign");
            $table->foreign("user_id")->references("id")->on("users");

            $table->dropForeign("feedbacks_poll_id_foreign");
            $table->foreign("poll_id")->references("id")->on("polls");
        });
    }
};
