<?php

namespace App\Models\Log;

use Illuminate\Database\Eloquent\Model;

class Log extends Model {

	protected $fillable = array();

	protected $hidden = array();

	public function loggable() {
		return $this->morphTo();
	}

}
