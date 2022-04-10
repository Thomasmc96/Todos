<?php
// Include files
include_once '../Config/Cors.php';
include_once '../Config/Database.php';
require "../../vendor/autoload.php";
include_once "./UsersUtil.php";

// Get incoming data
$data = json_decode(file_get_contents("php://input"));

if(empty($data->email) || empty($data->password)){

    // Send error response
    echo json_encode([
        "message" => "Values are missing",
        "code" => 500
    ]);
    exit(0);
}

// Data fields
$email = $data->email;
$password = $data->password;
        
// Login
login($email, $password);
