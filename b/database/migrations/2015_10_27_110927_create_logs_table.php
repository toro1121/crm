<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLogsTable extends Migration {
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up() {
		if(!Schema::hasTable('logs')) {
			Schema::create('logs', function(Blueprint $table) {
				$table->increments('id');
				$table->integer('foreign_id')->unsigned();
				$table->string('model')->nullable();
				$table->string('type')->nullable();
				$table->text('content');
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
		if(Schema::hasTable('logs')) {
			Schema::drop('logs');
		}
	}

}
