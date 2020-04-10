<?
session_start();
include "as.php";
?>
<!doctype html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, user-scalable=no">
	<link rel="stylesheet" href="css/reset.css" media="all">
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
	<link rel="stylesheet" href="template_styles.css" media="all">
	<title></title>
</head>

<body>
	<form name="form">
		<!-- name -->
		<div class="form-group">
			<input name="name" class="form-control input-name" placeholder="Имя">
		</div>
		<!-- phone -->
		<div class="form-group">
			<input name="phone" data-required class="form-control input-phone">
		</div>
		<!-- address -->
		<div class="form-group">
			<input name="address" data-required id="input-address" class="form-control" placeholder="Адрес">
		</div>
		<!-- map -->
		<div id="map"></div>
		<!-- captcha -->
		<div class="form-group row">
			<div class="col">
				<div class="captcha">
					<div class="form-group">
						<input name="captcha" data-required class="form-control input-captcha">
					</div>
					<img src="images/c.gif" alt="">
				</div>
			</div>
			<div class="col-4 text-right">
				<button type="submit" class="btn btn-primary">Отправить</button>
			</div>
		</div>
	</form>
</body>

<script src="js/intlTelInput.min.js"></script>
<script src="js/utils.js"></script>
<script src="https://unpkg.com/imask@6.0.3/dist/imask.js"></script>
<script src="https://api-maps.yandex.ru/2.1/?lang=ru_RU&amp;apikey=1cfd634e-03f9-4b79-bfcc-7a6611ee3ed1" type="text/javascript"></script>
<script src="js/main.js"></script>

</html>
