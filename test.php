<?
// name
$str = "fgsdf-AвdвTыFВАПdfdasfDАрооGffgJОдлодщоД$";
$result = preg_match('/^([a-zа-я.\-]+)$/iu', $str);

// phone
$str = "+7 (921) 571-54-64";
$result = preg_match('/^([+0-9()\- ]+)$/', $str);

// address
$str = "Россия, Вологодская область, Вологодский район, сельское поселение Подлесное, река Лихтошь-2.:";
$result = preg_match('/^([a-zа-я0-9(),._:\- ]+)$/iu', $str);

// captcha
$str = "5487";
$result = preg_match('/^([0-9]+)$/', $str);


echo "<pre>";
print_r($result);
echo "</pre>";