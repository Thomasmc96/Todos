<?php
// Include files
require "../../vendor/autoload.php";
include_once "./UsersUtil.php";

// Get incoming data
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->users_id) || empty($data->users_id)) {

    // Send error response
    echo json_encode([
        "message" => "Values are missing",
        "code" => 500
    ]);
    exit(0);
}

// Data fields
$users_id = base64_decode($data->users_id);

UsersUtil::deleteProfile($users_id);
