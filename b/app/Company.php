<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Company extends Model {

	public function user() {
		return $this->belongsTo('App\User');
	}

	public function client() {
		return $this->hasMany('App\Client');
	}

	public function industry() {
		return $this->morphToMany('App\Tag', 'taggable')->where('type', __FUNCTION__);
	}

	public function tag() {
		return $this->morphToMany('App\Tag', 'taggable')->where('type', '!=', array(
			'industry',
			'office'
		));
	}

}
