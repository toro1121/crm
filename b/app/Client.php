<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Client extends Model {

	public function user() {
		return $this->belongsTo('App\User');
	}

	public function company() {
		return $this->belongsTo('App\Company');
	}

	public function office() {
		return $this->morphToMany('App\Tag', 'taggable')->where('type', __FUNCTION__);
	}

	public function tag() {
		return $this->morphToMany('App\Tag', 'taggable')->where('type', null);
	}

}
