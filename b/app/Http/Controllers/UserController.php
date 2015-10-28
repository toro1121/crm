<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Models\User\User;
use App\Log;
use Input;
use Auth;
use Mail;
use File;

class UserController extends ApiController {
	public function status() {
		if(env('APP_ENV') == 'test') {
			$this->res = array(
				'bool' => TRUE,
				'data' => User::find(1)
			);
		}
		else {
			$this->res = array(
				'bool' => Auth::check(),
				'data' => Auth::user()
			);
		}
		return $this->res;
	}

	public function login() {
		$remember = Input::get('remember') == 'true' ? TRUE : FALSE;
		if(Auth::attempt(array(
			'username' => Input::get('username'),
			'password' => Input::get('password')
		), $remember)) {
			//登入記錄
			$log = new Log;
			$log->foreign_id = Auth::user()->id;
			$log->model = 'App\User';
			$log->type = 'login';
			$log->content = \Request::getClientIp(true);
			$log->save();

			$this->res = array(
				'bool' => Auth::check(),
				'message' => '登入成功!',
				'data' => Auth::user()
			);
		}
		else {
			$this->res = array(
				'bool' => Auth::check(),
				'message' => '查無此帳號!'
			);
		}
		return $this->res;
	}

	public function logout() {
		Auth::logout();
		$this->res = array(
			'bool' => Auth::check(),
			'message' => '登出成功!'
		);
		return $this->res;
	}

	public function register() {
		$this->res = $this->store();
		if($this->res['bool']) {
			$this->res['message'] = '帳號註冊成功!';
		}
		else {
			$this->res['message'] = '帳號註冊失敗!';
		}
		return $this->res;
	}

	public function forget() {
		if($user = User::where('name', Input::get('name'))->where('username', Input::get('username'))->take(1)->get()) {
			$password = rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9);
			$this->res = $this->update($user[0]->id, array(
				'password' => $password,
				'password_note' => $password
			));
			if($this->res['bool']) {
				$user = $this->res['data'][0];
				//密碼通知信
				if(Mail::send('emails.forget', array('data' => $user), function($message) use ($user) {
					$message->from(env('APP_EMAIL'), env('APP_NAME') . 'CRM');
					$message->to($user->email, $user->name)->subject('密碼通知信');
				})) {
					$this->res = array(
						'bool' => TRUE,
						'message' => '重設密碼信已寄出!'
					);
				}
				else {$this->res = array(
						'bool' => FALSE,
						'message' => '重設密碼信發送失敗!'
					);
				}
			}
		}
		else {
			$this->res['message'] = '查無此帳號!';
		}
		return $this->res;
	}

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
		return User::all();
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

		if(\App\Models\User\UserService::data(new User, $data)) {
			//帳號註冊成功通知信
			Mail::send('emails.register', array('data' => $user), function($message) use ($user) {
				$message->from(env('APP_EMAIL'), env('APP_NAME') . 'CRM');
				$message->to($user->email, $user->name)->subject('帳號註冊成功');
			});

			$this->res = array(
				'bool' => TRUE,
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
		$this->res['data'] = User::where('id', '=', $id)->get();
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
	public function update($id, $data = FALSE) {
		$data = $data ? $data : Input::all();
		$isProfile = isset($data['isProfile']);
		unset($data['isProfile']);

		if(\App\Models\User\UserService::data(User::find($id), $data)) {
			$this->res = array(
				'bool' => TRUE,
				'message' => 'success!',
				'data' => User::where('id', $id)->get(),
				'isProfile' => $isProfile
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
		//
	}

}
