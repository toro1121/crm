<?php

namespace App\Models\Tag;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model {

	protected $fillable = array();

	public function user() {
		return $this->belongsTo('App\Models\User\User');
	}

	public function parent() {
		return $this->belongsTo('App\Models\Tag\Tag', 'parent_id');
	}

	public function child() {
		return $this->hasMany('App\Models\Tag\Tag', 'parent_id')->whereRaw('parent_id != id');
	}

	public function company() {
		return $this->morphedByMany('App\Models\Company\Company', 'taggable');
	}

	public function client() {
		return $this->morphedByMany('App\Models\Client\Client', 'taggable');
	}

}
