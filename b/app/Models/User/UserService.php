<?php

namespace App\Models\User;

class UserService {

	public static function data($user, $data) {
		foreach ($data as $key => $value) {
			$user->$key = $key == 'password' ? bcrypt($value) : $value;
		}
		if (isset($data['password']) && $data['password']) {
			$user->password_note = $data['password'];
		}
		return $user->save();
	}

}
