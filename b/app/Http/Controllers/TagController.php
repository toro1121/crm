<?php

namespace App\Http\Controllers;

use App\Models\Tag\Tag;
use Input;

class TagController extends ApiController {

	private function data($fn, $id, $parent_id = FALSE) {
		if ($id) {
			$this->res['data'] = Tag::with('user')->where('id', $id)->get();
		} else {
			$fn($parent_id);
		}
		return $this->res;
	}

	public function group($id = FALSE) {
		return $this->data(function () {
			$this->res['data'] = Tag::with('user', 'child')->whereRaw('parent_id = id')->where('type', NULL)->get();
		}, $id);
	}

	public function item($parent_id, $id = FALSE) {
		return $this->data(function ($parent_id) {
			$this->res['data'] = Tag::with('user')->whereRaw('parent_id != id')->where('parent_id', $parent_id)->get();
		}, $id, $parent_id);
	}

	public function industry($parent_id = 1, $id = FALSE) {
		return $this->item($parent_id, $id);
	}

	public function career($parent_id = 2, $id = FALSE) {
		return $this->item($parent_id, $id);
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index() {
		$this->res['data'] = Tag::with(array(
			'parent',
			'child' => function ($q) {
				$q->with('client');
			},
			'client' => function ($q) {
			},

		))->where('type', null)->orderBy('parent_id', 'asc')->orderBy('id', 'asc')->get();
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
		$tagType = $data['tagType'];
		unset($data['tagType']);

		$tag = new Tag;
		foreach ($data as $key => $value) {
			$tag->$key = $value;
		}

		if ($tag->save()) {
			if (!isset($data['parent_id'])) {
				$tag->parent_id = $tag->id;
				$tag->save();
			}
			$this->res = array(
				'bool' => true,
				'message' => 'success!',
				'type' => $tagType,
				'data' => Tag::where('id', $tag->id)->get(),
			);
		} else {
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
		$this->res['data'] = Tag::where('id', $id)->get();
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
		$tagType = $data['tagType'];
		unset($data['tagType']);

		$tag = Tag::find($id);
		foreach ($data as $key => $value) {
			$tag->$key = $value;
		}

		if ($tag->save()) {
			$this->res = array(
				'bool' => true,
				'message' => 'success!',
				'type' => $tagType,
				'data' => Tag::where('id', $id)->get(),
			);
		} else {
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
		if (!($parent_id = Input::get('parent_id'))) {
			Tag::whereIn('parent_id', Input::get('id'))->delete();
		}
		Tag::whereIn('id', Input::get('id'))->delete();

		return $parent_id ? $this->item($parent_id) : $this->group();
	}

}
