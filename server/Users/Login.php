<?php
// Include files
include_once '../Config/Cors.php';
include_once '../Config/Database.php';
require "../../vendor/autoload.php";

use Firebase\JWT\JWT;

// Establish database connection
$datebaseService = new DatabaseService();
$connection = $datebaseService->getConnection();

 // Get incoming data
 $data = json_decode(file_get_contents("php://input"));

 try{

    if(empty($data->email) || empty($data->password)){
        http_response_code(500);

        // Send error response
        echo json_encode([
            "message" => "Values are missing"
        ]);
        exit(0);
    }

    // Data fields
    $email = $data->email;
    $password = $data->password;

    // Prepare query
    $query = "
        SELECT 
            users_id, name, password 
        FROM 
            users
        WHERE 
            email = :email 
        LIMIT 0,1";

    $statement = $connection->prepare($query);
    $statement->bindParam("email", $email);
    $statement->execute();

    $num = $statement->rowCount();

    if ($num > 0) {
        $row = $statement->fetch(PDO::FETCH_ASSOC);
        $id = $row['users_id'];
        $name = $row['name'];
        $password2 = $row['password'];

        if (password_verify($password, $password2)) {
            $secret_key = "YOUR_SECRET_KEY";
            $issuer_claim = "THE_ISSUER"; // this can be the servername
            $audience_claim = "THE_AUDIENCE";
            $issuedat_claim = time(); // issued at
            $notbefore_claim = $issuedat_claim; //not before in seconds
            $expire_claim = $issuedat_claim + 3600; // expire time in seconds
            $token = array(
                "iss" => $issuer_claim,
                "aud" => $audience_claim,
                "iat" => $issuedat_claim,
                "nbf" => $notbefore_claim,
                "exp" => $expire_claim,
                "data" => array(
                    "id" => $id,
                    "name" => $name,
                    "email" => $email
                )
            );

            $jwt = JWT::encode($token, $secret_key, 'HS256');
            echo json_encode(
                array(
                    "message" => "Successful login",
                    "code" => 200,
                    "jwt" => $jwt,
                    "email" => $email,
                    "expireAt" => $expire_claim
                )
            );
        } else {
            echo json_encode(array("message" => "Login failed", "code" => 401));
        }
    } else {
        echo json_encode(array("message" => "Login failed", "code" => 401));
    }
}
catch(\Exception $e) {
    http_response_code(500);

     // Send error response
     echo json_encode([
         "message" => $e,
         "code" => 401
     ]);
}