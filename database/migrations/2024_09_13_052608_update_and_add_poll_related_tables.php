<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        // Add missing columns to the 'polls' table if it already exists
        if (Schema::hasTable('polls')) {
            Schema::table('polls', function (Blueprint $table) {
                if (!Schema::hasColumn('polls', 'post_id')) {
                    $table->foreignUuid('post_id')->constrained()->onDelete('cascade'); // Connect to posts
                }
                if (!Schema::hasColumn('polls', 'end_date')) {
                    $table->timestamp('end_date')->nullable(); // Optional end date
                }
            });
        }

        // Create the 'questions' table if it doesn't exist
        if (!Schema::hasTable('questions')) {
            Schema::create('questions', function (Blueprint $table) {
                $table->id();
                $table->foreignUuid('poll_id')->constrained()->onDelete('cascade'); // Connect to polls
                $table->text('question_text');
                $table->enum('question_type', ['single_choice', 'multiple_choice']);
                $table->timestamps();
            });
        }

        // Create the 'options' table if it doesn't exist
        if (!Schema::hasTable('options')) {
            Schema::create('options', function (Blueprint $table) {
                $table->id();
                $table->foreignId('question_id')->constrained()->onDelete('cascade'); // Connect to questions
                $table->string('option_text');
                $table->timestamps();
            });
        }

        // Create the 'responses' table if it doesn't exist
        if (!Schema::hasTable('responses')) {
            Schema::create('responses', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade'); // User submitting the response
                $table->foreignUuid('poll_id')->constrained()->onDelete('cascade'); // The poll the response is for
                $table->foreignId('question_id')->constrained()->onDelete('cascade'); // The question the response is for
                $table->foreignId('option_id')->constrained()->onDelete('cascade'); // The selected option
                $table->timestamps();
            });
        }

        // Create the 'feedbacks' table if it doesn't exist
        if (!Schema::hasTable('feedbacks')) {
            Schema::create('feedbacks', function (Blueprint $table) {
                $table->id();
                $table->foreignUuid('poll_id')->constrained()->onDelete('cascade'); // Poll the feedback is for
                $table->foreignId('user_id')->constrained()->onDelete('cascade'); // User giving feedback
                $table->text('feedback_text');
                $table->timestamps();
            });
        }
    }

    public function down()
    {
        // Revert the changes
        Schema::table('polls', function (Blueprint $table) {
            if (Schema::hasColumn('polls', 'post_id')) {
                $table->dropForeign(['post_id']);
                $table->dropColumn('post_id');
            }
            if (Schema::hasColumn('polls', 'end_date')) {
                $table->dropColumn('end_date');
            }
        });

        Schema::dropIfExists('questions');
        Schema::dropIfExists('options');
        Schema::dropIfExists('responses');
        Schema::dropIfExists('feedbacks');
    }
};
