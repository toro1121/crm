<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Models\Client\Client;
use App\Models\Tag\Taggable;
use Input;

class ClientController extends ApiController {
	public function file($id = FALSE) {
		$id = $id ? $id : Input::get('id');
		if($id) {
			$path = storage_path("uploads/user/{$id}");
			switch(\Request::method()) {
				case'GET':
					$file = storage_path('photo.jpg');
					foreach(File::files($path) as $f) {
						if(preg_match("/photo\.[a-z]+/", $f)) {
							$file = $f;
							break;
						}
					}

					return \App\Support\Helpers\FileHelper::imageDisplay($file);
					break;
				case 'POST':
					if(Input::hasFile('file')) {
						if(File::isDirectory($path)) {
							File::deleteDirectory($path);
						}

						//處理圖片
						if(\App\Support\Helpers\FileHelper::image(Input::file('file'), array(
							$path,
							'photo.' . strtolower(Input::file('file')->getClientOriginalExtension())
						), 100)) {
							$user = User::find($id);
							$user->file = md5(rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9));
							$user->save();
						}

						$this->res['data'] = User::where('id', $id)->get();
						$this->res['isProfile'] = TRUE;
						return $this->res;
					}
					break;
			}
		}
	}

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
		//刪除tag關聯記錄
		Taggable::whereIn('taggable_id', Input::get('id'))->where('taggable_type', 'App\Client')->delete();
		return $this->index();
	}

}
