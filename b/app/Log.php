<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Log extends Model {

	protected $fillable = array();

	protected $hidden = array(
		'model',
		'type'
	);

}
