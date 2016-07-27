<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
 */

Route::group(['prefix' => 'api'], function () {
    Route::get('/', 'ApiController@index');

    //User (no auth)
    Route::group(['prefix' => 'user'], function () {
        Route::get('status', 'UserController@status');
        Route::post('login', 'UserController@login');
        Route::get('logout', 'UserController@logout');
        Route::post('register', 'UserController@register');
        Route::post('forget', 'UserController@forget');
    });

    Route::group(['middleware' => 'auth'], function () {
        //User
        Route::resource('user', 'UserController');

        //Log
        Route::resource('log', 'LogController');

        //File
        Route::resource('file', 'FileController');

        //Company
        Route::resource('company', 'CompanyController');

        //Client
        Route::resource('client', 'ClientController');

        //Tag
        Route::group(['prefix' => 'tag'], function () {
            Route::get('group/{id?}', 'TagController@group');
            Route::get('item/{parent_id}/{id?}', 'TagController@item');
            Route::get('industry/{id?}', 'TagController@industry');
            Route::get('career/{id?}', 'TagController@career');
        });
        Route::resource('tag', 'TagController');
    });
});
