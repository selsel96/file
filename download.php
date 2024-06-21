<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Set the content type to JSON
header('Content-Type: application/json');

$response = array('success' => false);

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Assuming name, mobile, and email are passed in the POST request
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $mobile = isset($_POST['mobile']) ? trim($_POST['mobile']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';

    // Simple validation
    if (!empty($name) && preg_match('/^[0-9]{10}$/', $mobile) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Process the form (e.g., save to database, send email, etc.)
        $recipient = "selvi211996@gmail.com";
        $from_email = "info@gmail.com";
        $site_name = "popup";
        $subject = "Download brochure form";
        $email_content = "Name: $name\n";
        $email_content .= "Mobile: $mobile\n";
        $email_content .= "Email: $email\n";

        $headers = "From: $site_name <$from_email>\r\n";
        $headers .= "Reply-To: $email\r\n";
        $headers .= 'BCC: selvisinkwc@gmail.com' . "\r\n";
        
        // Attempt to send the email
        if (mail($recipient, $subject, $email_content, $headers)) {
            // Email sent successfully
            $response['success'] = true;
            $response['mail_sent'] = true;
        } else {
            // Failed to send email
            $response['success'] = false; // Ensure success is explicitly false
            $response['error'] = 'Failed to send email';
        }
    } else {
        // Invalid form data
        $response['error'] = 'Invalid form data';
    }
}

echo json_encode($response);
?>
