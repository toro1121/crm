<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model {
	
	public function user() {
		return $this->belongsTo('App\User');
	}

	public function parent() {
		return $this->belongsTo('App\Tag', 'parent_id');
	}

	public function child() {
		return $this->hasMany('App\Tag', 'parent_id')->whereRaw('parent_id != id');
	}

	public function company() {
		return $this->morphedByMany('App\Company', 'taggable');
	}

	public function client() {
		return $this->morphedByMany('App\Client', 'taggable');
	}

}
