<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\User;
use Input;
use Auth;
use Mail;
use File;
use Image;

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
		if($user = User::where('name', Input::get('name'))->where('username', Input::get('username'))->find(1)) {
			$password = rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9);
			$user->password = bcrypt($password);
			$user->password_note = $password;
			$user->save();

			if(Mail::send('emails.forget', array('data' => $user), function($message) use ($user) {
				$message->from('service@51liangyi.com', '華人良醫CRM');
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

					if(File::exists($file)) {
						$response = \Response::make(File::get($file), 200);
						$response->header('Content-Type', File::type($file));
						return $response;
					}
					break;
				case 'POST':
					if(Input::hasFile('file')) {
						$file = Input::file('file');

						if(File::isDirectory($path)) {
							File::deleteDirectory($path);
						}

						$fileName = 'photo.' . strtolower($file->getClientOriginalExtension());
						//處理圖片
						$img = Image::make($file);
						$w = $img->width();
						$h = $img->height();
						if($w > $h) {
							$width = $height = $h;
							$x = ($w - $h) / 2;
							$y = 0;
						}
						else if($w < $h) {
							$width = $height = $x = $w;
							$x = 0;
							$y = ($h - $w) / 2;
						}
						if(isset($width) && isset($height)) {
							$img->crop($width, $height, $x, $y);
						}
						$img->resize(200, 200)->save();

						$file->move($path, $fileName);

						$user = User::find($id);
						$user->file = md5(rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9));
						$user->save();

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

		$user = new User;
		foreach($data as $key => $value) {
			$user->$key = $key == 'password' ? bcrypt($value) : $value;
		}

		if($user->save()) {
			// TODO: 帳號註冊成功通知信
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
	public function update($id) {
		$data = Input::all();
		$isProfile = isset($data['isProfile']);
		unset($data['isProfile']);

		$user = User::find($id);
		foreach($data as $key => $value) {
			$user->$key = $key == 'password' ? bcrypt($value) : $value;
		}

		if($user->save()) {
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
