<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

//load model
use App\User;
use App\Company;
use App\Client;
use App\Tag;

class DatabaseSeeder extends Seeder {
	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run() {
		Model::unguard();

		$this->call(UserTableSeeder::class);
		$this->call(CompanyTableSeeder::class);
		$this->call(ClientTableSeeder::class);
		$this->call(TagTableSeeder::class);
		$this->call(TaggableTableSeeder::class);

		Model::reguard();
	}

}

class UserTableSeeder extends Seeder {

	public function run() {
		User::create(array(
			'username' => 'toro731121@gmail.com',
			'password' => Hash::make('12345678'),
			'name' => 'gmail',
			'email' => 'toro731121@gmail.com',
		));
		User::create(array(
			'username' => 'lee.toro@msa.hinet.net',
			'password' => Hash::make('12345678'),
			'name' => 'hinet',
			'email' => 'lee.toro@msa.hinet.net',
		));
	}

}

class CompanyTableSeeder extends Seeder {

	public function run() {
		Company::create(array(
			'name' => '華人良醫',
			'phone' => '02-26272257',
			'remark' => '我是"華人良醫"',
		));
		Company::create(array(
			'name' => '意揚電子',
			'remark' => '我是"意揚電子"',
		));
		Company::create(array(
			'name' => '台灣易揚',
			'remark' => '我是"台灣易揚"',
		));
	}

}

class ClientTableSeeder extends Seeder {

	public function run() {
		Client::create(array(
			'company_id' => 1,
			'name' => 'Leo Lee',
			'phone' => '02-26272257',
			'mobile' => '0952209992',
			'mail' => 'toro731121@gmail.com',
			'remark' => '我是leo',
		));
		Client::create(array(
			'company_id' => 2,
			'name' => 'David Hua',
			'phone' => '26272373',
			'mobile' => '0935111111',
			'mail' => 'david@gmail.com',
			'remark' => '我是大衛',
		));
		Client::create(array(
			'company_id' => 1,
			'name' => 'Jordan',
			'mail' => 'jordan@gmail.com',
			'remark' => 'I\'m Jordan.',
		));
		Client::create(array(
			'name' => 'Change',
			'mail' => 'change@gmail.com',
			'remark' => 'I\'m Change.',
		));
		Client::create(array(
			'company_id' => 3,
			'name' => '小花',
			'mail' => 'flower@gmail.com',
		));
	}

}

class TagTableSeeder extends Seeder {

	public function run() {
		Tag::create(array(
			'type' => 'industry',
			'parent_id' => 1,
			'name' => '產業'
		));

		Tag::create(array(
			'type' => 'career',
			'parent_id' => 2,
			'name' => '職業'
		));

		Tag::create(array(
			'type' => 'industry',
			'parent_id' => 1,
			'name' => '資訊業'
		));
		Tag::create(array(
			'type' => 'industry',
			'parent_id' => 1,
			'name' => '服務業'
		));
		Tag::create(array(
			'type' => 'industry',
			'parent_id' => 1,
			'name' => '製造業'
		));

		Tag::create(array(
			'type' => 'career',
			'parent_id' => 2,
			'name' => '總經理'
		));
		Tag::create(array(
			'type' => 'career',
			'parent_id' => 2,
			'name' => '工程師'
		));
		Tag::create(array(
			'type' => 'career',
			'parent_id' => 2,
			'name' => '助理'
		));
		//
		for($i = 1; $i <= 5; $i++) {
			Tag::create(array(
				'parent_id' => $i + 8,
				'name' => "test{$i}",
				'color' => sprintf('%06x', rand(0, 16777215))
			));
		}
	}

}

class TaggableTableSeeder extends Seeder {

	public function run() {
		// Taggable::create(array(
		// 'tag_id' => 1,
		// 'taggable_id' => 2,
		// 'taggable_type' => 'client'
		// ));
	}

}
