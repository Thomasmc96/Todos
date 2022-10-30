<?php
// Include files
include_once '../Config/Cors.php';
include_once '../Config/Database.php';
include_once "./NotificationsUtil.php";

// Get incoming data
$data = json_decode(file_get_contents("php://input"));

if (!isset($_GET['users_id'])) {

    // Send error response
    echo json_encode([
        "message" => "Values are missing",
        "code" => 500,
        "data" => $data
    ]);
    exit(0);
}

// Data fields
$users_id = base64_decode($_GET['users_id']);

// Login
NotificationsUtil::update($users_id);
