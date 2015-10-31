<?php

namespace App\Models\Company;

use Illuminate\Database\Eloquent\Model;

class Company extends Model {

	protected $fillable = array();

	public function user() {
		return $this->belongsTo('App\Models\User\User');
	}

	public function client() {
		return $this->hasMany('App\Models\Client\Client');
	}

	public function industry() {
		return $this->morphToMany('App\Models\Tag\Tag', 'taggable')->where('type', __FUNCTION__);
	}

	public function tag() {
		return $this->morphToMany('App\Models\Tag\Tag', 'taggable')->where('type', '!=', array(
			'industry',
			'career',
		));
	}

}
