<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTaggablesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up() {
		if(!Schema::hasTable('taggables')) {
			Schema::create('taggables', function(Blueprint $table) {
				$table->increments('id')->unsigned();
				$table->integer('tag_id')->unsigned();
				$table->integer('taggable_id')->unsigned();
				$table->string('taggable_type')->nullable();
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
		if(Schema::hasTable('taggables')) {
			Schema::drop('taggables');
		}
	}

}
