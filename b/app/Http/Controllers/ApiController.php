<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

class ApiController extends Controller {

    public $res = array(
        'bool' => false,
        'message' => null,
        'data' => array(),
    );

    public function __construct() {
        $this->middleware('apiBefore');
        $this->middleware('apiAfter');

        // if (\Request::has('env')) {
        //     header('Access-Control-Allow-Origin: *');
        //     header('Access-Control-Allow-Credentials: true');
        // }
    }

    public function __destruct() {
    }

    public function index() {
        $this->res['data'] = '1.0';
        return $this->res;
    }

}
