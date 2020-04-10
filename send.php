<?
session_start();

$fields = ["name", "phone", "address", "captcha"];
if(count($_POST)) {
	$error = 0;
	foreach ($_POST as $key => $value) {
		if(!in_array($key, $fields)) {
			headerError("Error field");
		}

		$value = trim($value);

		switch ($key) {
			case "name":
				!preg_match("/^([a-zа-я.\-]+)$/iu", $value) && $value != "" ? $error++ : "";
				break;			
			case "phone":
				!preg_match("/^([+0-9()\- ]+)$/", $value) ? $error++ : "";
				break;
			case "address":
				!preg_match("/^([a-zа-я0-9()\/,._:\- ]+)$/iu", $value) ? $error++ : "";
				break;
			case "captcha":
				!preg_match("/^([0-9]+)$/", $value) || md5($value) != $_SESSION["randomnr2"] ? $error++ : "";
				break;
		}

		$error > 0 ? headerError("Error value") : "";

		$_POST[$key] = addslashes($value);
	}

	sendEmail();

	// echo json_encode($_POST);
}

function headerError($text) {
	die(header("HTTP/1.0 400 ".$text));
}

function sendEmail() {
	require_once "PHPMailer/PHPMailerAutoload.php";

	$mail = new PHPMailer;
	$mail->CharSet = 'UTF-8';

	// От кого
	$mail->setFrom("diamondkim@yandex.ru");

	// Кому
	$mail->addAddress("diamondkim@yandex.ru");
	
	// Тема письма
	$mail->Subject = "Тест";

	// Тело письма
	$message = "Имя: ".$_POST["name"]."<br>Телефон: ".$_POST["phone"]."<br>Адрес: ".$_POST["address"];
	$mail->msgHTML($message);

	if($mail->send()) {
		logFile($message);
		$res = [true];
		include "as.php";
		echo json_encode($res);
	}else{
		headerError("Error sending");
	}
}

function logFile($message){
    $now = date("Y-m-d H:i:s");
    file_put_contents("logform.txt", $now."\r\nIP: ".$_SERVER["REMOTE_ADDR"]." ".$message."\r\n-------------------\r\n", FILE_APPEND);
}