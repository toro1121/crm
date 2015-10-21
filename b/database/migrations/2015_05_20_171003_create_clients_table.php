<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateClientsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up() {
		if(!Schema::hasTable('clients')) {
			Schema::create('clients', function(Blueprint $table) {
				$table->increments('id');
				$table->integer('user_id')->unsigned();
				$table->integer('company_id')->unsigned();
				$table->string('name')->unique();
				$table->string('ename')->nullable();
				$table->string('phone')->nullable();
				$table->string('mobile')->nullable();
				$table->string('email')->nullable();
				$table->string('address')->nullable();
				$table->text('remark')->nullable();
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
		if(Schema::hasTable('clients')) {
			Schema::drop('clients');
		}
	}

}
