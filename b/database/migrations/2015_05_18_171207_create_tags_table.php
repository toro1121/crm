<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateTagsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up() {
		if(!Schema::hasTable('tags')) {
			Schema::create('tags', function(Blueprint $table) {
				$table->increments('id')->unsigned();
				$table->integer('user_id')->unsigned();
				$table->integer('parent_id')->unsigned();
				$table->string('type')->nullable();
				// $table->integer('level')->unsigned();
				$table->string('name')->unique();
				$table->string('color')->nullable();
				$table->timestamps();
			});
		}
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down() {
		if(Schema::hasTable('tags')) {
			Schema::drop('tags');
		}
	}

}
