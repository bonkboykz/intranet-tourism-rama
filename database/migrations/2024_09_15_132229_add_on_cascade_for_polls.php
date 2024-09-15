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

        Schema::table("polls", function (Blueprint $table) {
            $table->dropForeign("polls_user_id_foreign");
            $table->foreign("user_id")->references("id")->on("users")->onDelete("cascade");

            $table->dropForeign("polls_post_id_foreign");
            $table->foreign("post_id")->references("id")->on("posts")->onDelete("cascade");
        });

        // delete question if poll is deleted
        Schema::table("questions", function (Blueprint $table) {
            $table->dropForeign("questions_poll_id_foreign");
            $table->foreign("poll_id")->references("id")->on("polls")->onDelete("cascade");
        });

        // delete responses if poll is deleted
        Schema::table("responses", function (Blueprint $table) {
            $table->dropForeign("responses_poll_id_foreign");
            $table->foreign("poll_id")->references("id")->on("polls")->onDelete("cascade");
        });

        // delete options if question if deleted
        Schema::table("options", function (Blueprint $table) {
            $table->dropForeign("options_question_id_foreign");
            $table->foreign("question_id")->references("id")->on("questions")->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table("polls", function (Blueprint $table) {
            $table->dropForeign("polls_user_id_foreign");
            $table->foreign("user_id")->references("id")->on("users");

            $table->dropForeign("polls_post_id_foreign");
            $table->foreign("post_id")->references("id")->on("posts");
        });

        Schema::table("questions", function (Blueprint $table) {
            $table->dropForeign("questions_poll_id_foreign");
            $table->foreign("poll_id")->references("id")->on("polls");
        });

        Schema::table("responses", function (Blueprint $table) {
            $table->dropForeign("responses_poll_id_foreign");
            $table->foreign("poll_id")->references("id")->on("polls");
        });

        Schema::table("options", function (Blueprint $table) {
            $table->dropForeign("options_question_id_foreign");
            $table->foreign("question_id")->references("id")->on("questions");
        });
    }
};
