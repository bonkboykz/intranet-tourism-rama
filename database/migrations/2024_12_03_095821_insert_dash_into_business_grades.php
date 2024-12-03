<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        // Insert '-' into the business_grades table if not already exists
        DB::statement("
            INSERT INTO business_grades (code)
            SELECT '-'
            WHERE NOT EXISTS (
                SELECT 1
                FROM business_grades
                WHERE code = '-'
            )
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        // Remove '-' from the business_grades table during rollback
        DB::statement("
            DELETE FROM business_grades
            WHERE code = '-'
        ");
    }
};
