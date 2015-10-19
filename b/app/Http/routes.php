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

Route::group(array('prefix' => 'api'), function() {
	Route::get('/', 'ApiController@index');

	Route::group(array('prefix' => 'user'), function() {
		Route::get('status', 'UserController@status');
		Route::get('login', 'UserController@login');
		Route::get('logout', 'UserController@logout');
		Route::get('register', 'UserController@register');
		Route::get('forget', 'UserController@forget');
	});

	Route::group(env('APP_ENV') == 'test' ? array() : array('middleware' => 'auth'), function() {
		Route::resource('user', 'UserController');
		Route::match(array(
			'get',
			'post'
		), 'user/file/{id?}', 'UserController@file');

		Route::resource('company', 'CompanyController');
		Route::resource('client', 'ClientController');

		Route::group(array('prefix' => 'tag'), function() {
			Route::get('group/{id?}', 'TagController@group');
			Route::get('item/{parent_id}/{id?}', 'TagController@item');
			Route::get('industry/{id?}', 'TagController@industry');
			Route::get('office/{id?}', 'TagController@office');
		});
		Route::resource('tag', 'TagController');
	});
});
