<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration {
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up() {
		if(!Schema::hasTable('users')) {
			Schema::create('users', function(Blueprint $table) {
				$table->increments('id')->unsigned();
				$table->string('username')->unique();
				$table->string('password');
				$table->text('password_note')->nullable();
				$table->rememberToken();
				$table->string('name');
				$table->string('email')->unique();
				$table->text('remark')->nullable();
				$table->text('file')->nullable();
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
		if(Schema::hasTable('users')) {
			Schema::drop('users');
		}
	}

}
