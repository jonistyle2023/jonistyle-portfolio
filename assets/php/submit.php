<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // Si usaste Composer

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Variables del formulario
    $name    = $_POST['name'] ?? '';
    $email   = $_POST['email'] ?? '';
    $subject = $_POST['subject'] ?? 'Sin Asunto';
    $comment = $_POST['comment'] ?? '';

    // Validar que no estén vacíos
    if (empty($name) || empty($email) || empty($comment)) {
        echo "Por favor llena todos los campos.";
        exit;
    }

    // Crear instancia PHPMailer
    $mail = new PHPMailer(true);

    try {
        // Configuración del servidor SMTP
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = $_ENV['MAIL_USERNAME'];          // <- CAMBIA ESTO
        $mail->Password   = $_ENV['MAIL_PASSWORD'];            // <- CONTRASEÑA DE APLICACIÓN
        $mail->SMTPSecure = 'tls';
        $mail->Port       = 587;

        // Destinatarios
        $mail->setFrom($email, $name);
        $mail->addAddress('jonathan1014@outlook.es', 'Destinatario'); // <- CORREO QUE RECIBE

        // Contenido del mensaje
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = "
            <strong>Name:</strong> {$name}<br>
            <strong>Email:</strong> {$email}<br>
            <strong>Message:</strong><br>{$comment}
        ";

        // Opciones de seguridad (por si falla certificado en localhost)
        $mail->SMTPOptions = [
            'ssl' => [
                'verify_peer'       => false,
                'verify_peer_name'  => false,
                'allow_self_signed' => true
            ]
        ];

        // Enviar el correo
        if ($mail->send()) {
            echo "Message sent successfully.";
        } else {
            echo "There was a problem sending the message.";
        }

    } catch (Exception $e) {
        echo "Error sending message: {$mail->ErrorInfo}";
    }
}

