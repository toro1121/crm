<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateFilesTable extends Migration {
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up() {
		if (!Schema::hasTable('files')) {
			Schema::create('files', function (Blueprint $table) {
				$table->increments('id');
				$table->integer('fileable_id')->unsigned();
				$table->string('fileable_type')->nullable();
				$table->string('type')->nullable();
				$table->string('name');
				$table->string('ext');
				$table->string('mimeType');
				$table->integer('width')->unsigned();
				$table->integer('height')->unsigned();
				$table->integer('size')->unsigned();
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
		if (Schema::hasTable('files')) {
			Schema::drop('files');
		}
	}
}
