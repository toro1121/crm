<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateCompaniesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up() {
		if(!Schema::hasTable('companies')) {
			Schema::create('companies', function(Blueprint $table) {
				$table->increments('id')->unsigned();
				$table->integer('user_id')->unsigned();
				$table->string('name')->unique();
				$table->string('ename')->nullable();
				$table->string('sname')->nullable();
				$table->string('number')->nullable();
				$table->string('capital')->nullable();
				$table->string('scale')->nullable();		
				$table->string('phone')->nullable();
				$table->string('fax')->nullable();
				$table->string('email')->nullable();
				$table->string('website')->nullable();
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
		if(Schema::hasTable('companies')) {
			Schema::drop('companies');
		}
	}

}
