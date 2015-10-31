<?php

namespace App\Http\Controllers;

use App\Models\Company\Company;
use App\Models\Tag\Taggable;
use Input;

class CompanyController extends ApiController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index() {
		$this->res['data'] = Company::with('user', 'industry', 'client')->get();
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
		$industry = $data['industry'];
		unset($data['industry']);

		$company = new Company;
		foreach ($data as $key => $value) {
			$company->$key = $value;
		}

		if ($company->save()) {
			$company->industry()->sync(array($industry));

			$this->res = array(
				'bool' => true,
				'message' => 'success!',
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
		$this->res['data'] = Company::with('user', 'industry', 'client')->where('id', $id)->get();
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
		$industry = $data['industry'];
		unset($data['industry']);

		$company = Company::find($id);
		foreach ($data as $key => $value) {
			$company->$key = $value;
		}

		if ($company->save()) {
			$company->industry()->sync(array($industry));

			$this->res = array(
				'bool' => true,
				'message' => 'success!',
				'data' => Company::with('industry', 'client')->where('id', $id)->get(),
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
		Company::whereIn('id', Input::get('id'))->delete();
		//刪除tag關聯記錄
		Taggable::whereIn('taggable_id', Input::get('id'))->where('taggable_type', 'App\Company')->delete();
		return $this->index();
	}

}
