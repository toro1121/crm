<?php

namespace App\Models\User;

use Illuminate\Auth\Authenticatable;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\Access\Authorizable;

class User extends Model implements AuthenticatableContract,
AuthorizableContract,
CanResetPasswordContract {

	use Authenticatable, Authorizable, CanResetPassword;

	protected $guarded = array('id', 'username', 'password');

	protected $hidden = array('password', 'password_note', 'remember_token');

	public function files() {
		return $this->morphMany('App\Models\File\File', 'fileable');
	}

	public function logs() {
		return $this->morphMany('App\Models\Log\Log', 'loggable');
	}

}
