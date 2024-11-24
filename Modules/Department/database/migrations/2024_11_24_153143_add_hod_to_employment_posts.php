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
        Schema::table('employment_posts', function (Blueprint $table) {
            // add is_hod and is_assistance columns
            $table->boolean('is_hod')->default(false);
            $table->boolean('is_assistance')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employment_posts', function (Blueprint $table) {
            $table->dropColumn('is_hod');
            $table->dropColumn('is_assistance');
        });
    }
};
