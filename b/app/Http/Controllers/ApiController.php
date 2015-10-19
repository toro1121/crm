<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class ApiController extends Controller {

	public $res = array(
		'bool' => false,
		'message' => null,
		'data' => array()
	);

	public function __construct() {
		$this->middleware('apiBefore');
		$this->middleware('apiAfter');

		// header('Access-Control-Allow-Origin: *');
		// header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
		// header('Access-Control-Allow-Headers: Accept, Content-Type, Origin');
	}

	public function __destruct() {
	}

	public function index() {
		$this->res['data'] = '1.0';
		return $this->res;
	}

}
