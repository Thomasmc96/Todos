<?php
// Include files
include_once '../Config/Cors.php';
include_once '../Config/Database.php';
require "../../vendor/autoload.php";
include_once "./UsersUtil.php";

// Get incoming data
$data = json_decode(file_get_contents("php://input"));

if (empty($_GET['users_id'])) {

    // Send error response
    echo json_encode([
        "message" => "Missing users_id",
        "code" => 500
    ]);
    exit(0);
}

// Data fields
$users_id = base64_decode($_GET['users_id']);

// Login
UsersUtil::getUser($users_id);
