<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

class ApiController extends Controller {

    public $res = [
        'bool' => false,
        'message' => null,
        'data' => [],
    ];

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
        $this->res['bool'] = true;
        $this->res['data'] = [
            'version' => '0.1.0',
        ];
        return $this->res;
    }

}
