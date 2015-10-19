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
				// $table->integer('industry_id')->unsigned()->default(0);
				// $table->foreign('industry_id')->references('id')->on('industries');
				$table->string('name')->unique();
				$table->string('phone')->nullable();
				// $table->string('mobile')->nullable();
				$table->string('mail')->nullable();
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
