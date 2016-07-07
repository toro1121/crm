<?php

use App\Models\Client\Client;
use App\Models\Company\Company;

//load model
use App\Models\Tag\Tag;
use App\Models\User\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;

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
            'username' => 'demo@demo.com',
            'password' => Hash::make('demo@demo.com'),
            'name' => 'Demo',
            'email' => 'demo@demo.com',
        ));
        User::create(array(
            'username' => 'toro731121@gmail.com',
            'password' => Hash::make('12345678'),
            'name' => 'Toro',
            'email' => 'toro731121@gmail.com',
        ));
    }

}

class CompanyTableSeeder extends Seeder {

    public function run() {
        Company::create(array(
            'name' => 'Google',
            'phone' => '+1 650-253-0000',
            'remark' => '測試"',
        ));
        Company::create(array(
            'name' => 'Yahoo!',
            'remark' => 'Yahoo!"',
        ));
        Company::create(array(
            'name' => 'Facebook',
            'remark' => 'Facebook"',
        ));
    }

}

class ClientTableSeeder extends Seeder {

    public function run() {
        Client::create(array(
            'company_id' => 1,
            'name' => 'Leo Lee',
            'mobile' => '0952209992',
            'email' => 'toro731121@gmail.com',
            'address' => '台北市中山區',
            'remark' => '我是leo',
        ));
        Client::create(array(
            'company_id' => 2,
            'name' => 'David Hua',
            'phone' => '26272373',
            'mobile' => '0935111111',
            'email' => 'david@gmail.com',
            'remark' => '我是大衛',
        ));
        Client::create(array(
            'company_id' => 1,
            'name' => 'Jordan',
            'email' => 'jordan@gmail.com',
            'remark' => 'I\'m Jordan.',
        ));
        Client::create(array(
            'name' => 'Change',
            'email' => 'change@gmail.com',
            'remark' => 'I\'m Change.',
        ));
        Client::create(array(
            'company_id' => 3,
            'name' => '小花',
            'ename' => 'flower',
            'mobile' => '0952111111',
            'email' => 'flower@gmail.com',
            'address' => '新北市新莊區中正路800號',
        ));
    }

}

class TagTableSeeder extends Seeder {

    public function run() {
        Tag::create(array(
            'type' => 'industry',
            'parent_id' => 1,
            'name' => '產業',
        ));

        Tag::create(array(
            'type' => 'career',
            'parent_id' => 2,
            'name' => '職業',
        ));

        Tag::create(array(
            'type' => 'industry',
            'parent_id' => 1,
            'name' => '資訊業',
        ));
        Tag::create(array(
            'type' => 'industry',
            'parent_id' => 1,
            'name' => '服務業',
        ));
        Tag::create(array(
            'type' => 'industry',
            'parent_id' => 1,
            'name' => '製造業',
        ));
        Tag::create(array(
            'type' => 'industry',
            'parent_id' => 1,
            'name' => '金融業',
        ));

        Tag::create(array(
            'type' => 'career',
            'parent_id' => 2,
            'name' => '總經理',
        ));
        Tag::create(array(
            'type' => 'career',
            'parent_id' => 2,
            'name' => '資深工程師',
        ));
        Tag::create(array(
            'type' => 'career',
            'parent_id' => 2,
            'name' => '工程師',
        ));
        Tag::create(array(
            'type' => 'career',
            'parent_id' => 2,
            'name' => '設計師',
        ));
        Tag::create(array(
            'type' => 'career',
            'parent_id' => 2,
            'name' => '助理',
        ));
        //
        for ($i = 1; $i <= 5; $i++) {
            Tag::create(array(
                'parent_id' => $i + 11,
                'name' => "test{$i}",
                'color' => sprintf('%06x', rand(0, 16777215)),
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
