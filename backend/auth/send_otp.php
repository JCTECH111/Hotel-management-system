<?php 
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/../vendor/autoload.php'; // Ensure PHPMailer is installed

$mail = new PHPMailer(true);

try {
    $otp = rand(100000, 999999); // Generate 6-digit OTP

    // Load the OTP email template
    $htmlTemplate = file_get_contents("./otp_template.html");
    $htmlTemplate = str_replace("123456", $otp, $htmlTemplate); // Replace OTP in the template

    // SMTP Configuration
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'your-email@gmail.com';
    $mail->Password   = 'your-email-password'; // Use App Password for Gmail
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    // Email Headers
    $mail->setFrom('your-email@gmail.com', 'Your Hotel');
    $mail->addAddress('recipient@example.com', 'Recipient Name');

    // Email Content
    $mail->isHTML(true);
    $mail->Subject = 'Your OTP Code';
    $mail->Body    = $htmlTemplate;

    // Send Email
    $mail->send();
    echo 'OTP email sent successfully!';
} catch (Exception $e) {
    echo "Email could not be sent. Error: {$mail->ErrorInfo}";
}

?>