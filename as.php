<?
// создаем случайное число и сохраняем в сессии
$randomnr = rand(1000, 9999);
$_SESSION["randomnr2"] = md5($randomnr);

//создаем изображение
$im = imagecreatetruecolor(75, 38);

//цвета:
$white = imagecolorallocate($im, 255, 255, 255);
$grey = imagecolorallocate($im, 128, 128, 128);
$black = imagecolorallocate($im, 0, 0, 0);

imagefilledrectangle($im, 0, 0, 200, 35, $black);

//путь к шрифту:
$font = "font/BebasNeueBold.ttf";

//рисуем текст:
imagettftext($im, 27, 0, 11, 30, $grey, $font, $randomnr);
imagettftext($im, 27, 0, 8, 32, $white, $font, $randomnr);

imagegif($im, "images/c.gif");
imagedestroy($im);