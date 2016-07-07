<?php

namespace App\Http\Middleware;

use Closure;

class ApiAfter {

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next) {
        $response = $next($request);

        //debugbar
        $data = \Request::all();
        if (isset($data['debug'])) {
            \Debugbar::enable();
            echo '<pre>';
            print_r($response);
            echo '</pre>';
        } else {
            \Debugbar::disable();
            if (\Request::has('callback')) {
                $response = json_encode($response);
                echo \Request::get('callback') . "({$response})";
                exit;
            } else {
                return $response;
            }
        }
    }

}
