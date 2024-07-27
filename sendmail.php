<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';

$mail = new PHPMailer(true);
$mail->CharSet = 'UTF-8';
$mail->setLanguage('ru', 'phpmailer/language/');
$mail->IsHTML(true);

// От кого письмо
$mail->setFrom('michaeltitarenko@gmail.com', 'Сайт');
// Кому отправить
$mail->addAddress('michaeltitarenko@gmail.com');
// Тема письма
$mail->Subject = 'Новая обратная связь';

// Содержимое письма
$body = '<h1>Новое письмо от:</h1>';

if(trim(!empty($_POST['name']))){
  $body .= '<p><strong>Имя:</strong> ' . $_POST['name'] . '</p>';
}
if(trim(!empty($_POST['email']))){
  $body .= '<p><strong>Email:</strong> ' . $_POST['email'] . '</p>';
}
if(trim(!empty($_POST['phone']))){
  $body .= '<p><strong>Телефон:</strong> ' . $_POST['phone'] . '</p>';
}

// Обработка чекбоксов
$checkboxes = ['checkbox1', 'checkbox2', 'checkbox3', 'checkbox4'];
$checkedCheckboxes = [];
foreach($checkboxes as $checkbox) {
  if(isset($_POST[$checkbox]) && $_POST[$checkbox] === 'on') {
    $checkedCheckboxes[] = $checkbox;
  }
}

if(!empty($checkedCheckboxes)) {
  $body .= '<p><strong>Чекбоксы:</strong> ' . implode(', ', $checkedCheckboxes) . '</p>';
}

// Проверка на согласие обработки персональных данных
if(isset($_POST['agreevment']) && $_POST['agreevment'] === 'on') {
  $body .= '<p><strong>Согласие на обработку персональных данных:</strong> Да</p>';
} else {
  $body .= '<p><strong>Согласие на обработку персональных данных:</strong> Нет</p>';
}

$mail->Body = $body;

if(!$mail->send()){
  $message = 'Ошибка!'; 
}else {
  $message = 'Данные отправлены!'; 
}

$response =['message' => $message];

header('Content-Type: application/json');
echo json_encode($response);
?>
