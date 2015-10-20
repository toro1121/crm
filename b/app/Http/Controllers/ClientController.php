<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Client;
use Input;

class ClientController extends ApiController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index() {
		$this->res['data'] = Client::with('user', 'company', 'career', 'tag')->get();
		return $this->res;
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create() {
		//
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store() {
		$data = Input::all();
		$tag = explode(',', $data['tag']);
		$tag = array_merge(array($data['career']), $tag[0] ? $tag : array());
		unset($data['career'], $data['tag']);

		$client = new Client;
		foreach($data as $key => $value) {
			$client->$key = $value;
		}

		if($client->save()) {
			$client->tag()->sync($tag);

			$this->res = array(
				'bool' => true,
				'message' => 'success!'
			);
		}
		else {
			$this->res['message'] = 'fail!';
		}

		return $this->res;
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id) {
		$this->res['data'] = Client::with('user', 'company', 'career', 'tag')->where('id', $id)->get();
		return $this->res;
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id) {
		//
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id) {
		$data = Input::all();
		$tag = explode(',', $data['tag']);
		$tag = array_merge(array($data['career']), $tag[0] ? $tag : array());
		unset($data['career'], $data['tag']);

		$client = Client::find($id);
		foreach($data as $key => $value) {
			$client->$key = $value;
		}

		if($client->save()) {
			$client->tag()->sync($tag);

			$this->res = array(
				'bool' => TRUE,
				'message' => 'success!',
				'data' => Client::with('company', 'career', 'tag')->where('id', $id)->get()
			);
		}
		else {
			$this->res['message'] = 'fail!';
		}

		return $this->res;
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id) {
		Client::whereIn('id', Input::get('id'))->delete();
		return $this->index();
	}

}
