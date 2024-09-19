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
        Schema::table('posts', function (Blueprint $table) {
            // add nullable reference to department
            $table->foreignId('department_id')->nullable()->constrained('departments')->onDelete('set null');
            // add nullable reference to community
            $table->foreignId('community_id')->nullable()->constrained('communities')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropForeign(['department_id']);
            $table->dropColumn('department_id');
            $table->dropForeign(['community_id']);
            $table->dropColumn('community_id');
        });
    }
};
