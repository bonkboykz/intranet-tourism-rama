<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;


return new class extends Migration {

    public function up()
    {
        // Ensure all user_id values are numeric
        DB::statement("UPDATE audits SET user_id = NULL WHERE user_id !~ '^\d+$'");

        // Change the column type to BIGINT
        DB::statement('ALTER TABLE audits ALTER COLUMN user_id TYPE BIGINT USING user_id::BIGINT');
    }

    public function down()
    {
        Schema::table('audits', function (Blueprint $table) {
            $table->string('user_id')->change();
        });
    }
};

