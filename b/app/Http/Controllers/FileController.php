<?php

namespace App\Http\Controllers;

use App\Models\File\File;
use Illuminate\Http\Request;
use Input;

class FileController extends ApiController {
	/**
	 * Display a listing of the resource.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index() {
		//
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function create() {
		//
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(Request $request) {
		if (Input::hasFile('file')) {
			$user_id = \Auth::user()->id;

			//刪除tmp裡檔案
			\App\Support\Helpers\FileHelper::tmpFileRemove($path = storage_path("uploads/tmp/{$user_id}"));

			//處理圖片
			$file = Input::file('file');
			$filename = \App\Support\Helpers\CommonHelper::randomWord();
			if ($info = \App\Support\Helpers\FileHelper::image($file, array(
				$path,
				$filename,
			), 100)) {
				\Session::pull('file');
				\Session::push('file', array_merge($info, [
					'type' => 'photo',
					'name' => $filename,
					'ext' => $file->getClientOriginalExtension(),
					'size' => \File::size("{$path}/{$filename}"),
				]));
			}
		}
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($id) {
		$path = storage_path('photo.jpg');
		if ($file = File::where('id', $id)->get()) {
			if (count($file)) {
				$file = $file[0];
				$type = explode('\\', $file['fileable_type']);
				$type = strtolower($type[count($type) - 1]);
				$path = storage_path("uploads/{$type}/{$file['fileable_id']}/{$file['name']}");
			}
		}
		return \App\Support\Helpers\FileHelper::imageDisplay($path);
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function edit($id) {
		//
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function update(Request $request, $id) {
		//
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($id) {
		//
	}
}
