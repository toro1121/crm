<?
namespace App\Support\Helpers;

use File;
use Image;

class FileHelper {

	public static function imageDisplay($file) {
		if(File::exists($file)) {
			$response = \Response::make(File::get($file), 200);
			$response->header('Content-Type', File::type($file));
			return $response;
		}
	}

	public static function image($source, $target, $limit = FALSE, $width = FALSE, $height = FALSE) {
		$img = Image::make($source);
		$w = $img->width();
		$h = $img->height();

		if($limit) {
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
			$img->resize($limit, $limit)->save();
		}

		$source->move($target[0], $target[1]);

		return TRUE;
	}

}
