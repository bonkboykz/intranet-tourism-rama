<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBirthdayTemplatesTable extends Migration
{
    public function up()
    {
        Schema::create('birthday_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('background')->nullable();
            $table->boolean('is_enabled')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('birthday_templates');
    }
}
