<?php

namespace App\Support\Helpers;

class CommonHelper {

	public static function randomWord() {
		return md5(date("YmdHis") . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9));
	}

}
