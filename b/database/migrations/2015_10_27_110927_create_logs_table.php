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
				$table->increments('id')->unsigned();
				$table->integer('loggable_id')->unsigned();
				$table->string('loggable_type')->nullable();
				$table->string('type')->nullable();
				$table->text('var_a');
				$table->text('var_b');
				$table->text('var_c');
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
