<?php

namespace App\Http\Controllers;

use App\Models\File\File;
use App\Models\Log\Log;
use App\Models\User\User;
use Illuminate\Http\Request;
use Input;

class UserController extends ApiController {

    public $develop;

    public function status() {
        $this->res = array(
            'bool' => \Auth::check(),
            // 'data' => \Auth::user(),
            'data' => \Auth::check() ? User::with('files')->find(\Auth::user()->id) : null,
        );

        // FORTEST:
        if (env('APP_ENV') == 'develop') {
            $this->res = array(
                'bool' => true,
                'data' => User::with('files')->find(1),
            );
        }

        return $this->res;
    }

    public function login() {
        $remember = Input::get('remember') == 'true' ? TRUE : FALSE;
        if (\Auth::attempt(array(
            'username' => Input::get('username'),
            'password' => Input::get('password'),
        ), $remember)) {
            //登入記錄
            $user = User::find(\Auth::user()->id);
            $log = new Log;
            $log->type = 'login';
            $log->var_a = \Request::getClientIp(true);
            $log->var_b = \App\Support\Helpers\CommonHelper::randomWord();
            $user->logs()->save($log);

            $this->res = array(
                'bool' => \Auth::check(),
                'message' => '登入成功!',
                // 'data' => \Auth::user(),
                'data' => User::with('files')->find(\Auth::user()->id),
            );
        } else {
            $this->res = array(
                'bool' => \Auth::check(),
                'message' => '查無此帳號!',
            );
        }
        return $this->res;
    }

    public function logout() {
        \Auth::logout();
        $this->res = array(
            'bool' => \Auth::check(),
            'message' => '登出成功!',
        );
        return $this->res;
    }

    public function register() {
        $this->res = $this->store();
        if ($this->res['bool']) {
            $this->res['message'] = '帳號註冊成功!';
        } else {
            $this->res['message'] = '帳號註冊失敗!';
        }
        return $this->res;
    }

    public function forget() {
        if ($user = User::where('name', Input::get('name'))->where('username', Input::get('username'))->take(1)->get()) {
            $password = rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9);
            $this->res = $this->update($user[0]->id, array(
                'password' => $password,
                'password_note' => $password,
            ));
            if ($this->res['bool']) {
                $user = $this->res['data'][0];
                //密碼通知信
                if (\Mail::send('emails.forget', array('data' => $user), function ($message) use ($user) {
                    $message->from(env('APP_EMAIL'), env('APP_NAME') . 'CRM');
                    $message->to($user->email, $user->name)->subject('密碼通知信');
                })) {
                    $this->res = array(
                        'bool' => TRUE,
                        'message' => '重設密碼信已寄出!',
                    );
                } else {
                    $this->res = array(
                        'bool' => FALSE,
                        'message' => '重設密碼信發送失敗!',
                    );
                }
            }
        } else {
            $this->res['message'] = '查無此帳號!';
        }
        return $this->res;
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

        if (\App\Models\User\UserService::data(new User, $data)) {
            //帳號註冊成功通知信
            \Mail::send('emails.register', array('data' => $user), function ($message) use ($user) {
                $message->from(env('APP_EMAIL'), env('APP_NAME') . 'CRM');
                $message->to($user->email, $user->name)->subject('帳號註冊成功');
            });

            $this->res = array(
                'bool' => TRUE,
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
        $this->res['data'] = User::with(['files', 'logs' => function ($q) {
            $q->take(1);
        }])->where('id', '=', $id)->get();
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

        if (\App\Models\User\UserService::data($user = User::find($id), $data)) {
            //處理照片
            if (\Session::has('file')) {
                $tmpfile = \Session::get('file');
                $file = count($user->files) ? File::find($user->files[0]->id) : new File;
                foreach ($tmpfile[0] as $key => $value) {
                    $file->$key = $value;
                }
                if ($user->files()->save($file)) {
                    $user_id = \Auth::user()->id;
                    $source = storage_path("uploads/tmp/{$user_id}");
                    if (\File::isDirectory($target = storage_path("uploads/user/{$id}"))) {
                        \File::deleteDirectory($target);
                    }
                    if (!\File::isDirectory(storage_path("uploads/user"))) {
                        \File::makeDirectory(storage_path("uploads/user"));
                    }
                    \File::move($source, $target);
                    \Session::pull('file');
                }
            }

            $this->res = array(
                'bool' => TRUE,
                'message' => 'success!',
                'data' => User::with('files')->where('id', $id)->get(),
                'isProfile' => $isProfile,
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
        //
    }

}
