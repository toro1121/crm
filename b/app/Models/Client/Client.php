<?php

namespace App\Models\Client;

use Illuminate\Database\Eloquent\Model;

class Client extends Model {

	protected $fillable = array();

	public function user() {
		return $this->belongsTo('App\Models\User\User');
	}

	public function company() {
		return $this->belongsTo('App\Models\Company\Company');
	}

	public function career() {
		return $this->morphToMany('App\Models\Tag\Tag', 'taggable')->where('type', __FUNCTION__);
	}

	public function tag() {
		return $this->morphToMany('App\Models\Tag\Tag', 'taggable')->where('type', null);
	}

}
