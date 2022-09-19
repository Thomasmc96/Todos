<?php
// Include files
include_once '../Config/Cors.php';
include_once '../Config/Database.php';
require "../../vendor/autoload.php";

use Firebase\JWT\JWT;

class UsersUtil
{
    public static function login($email, $password)
    {

        // Establish database connection
        $datebaseService = new DatabaseService();
        $connection = $datebaseService->getConnection();

        try {

            // Prepare query
            $query = "
            SELECT 
                users_id, name, password 
            FROM 
                users
            WHERE 
                email = :email 
            LIMIT 1";

            $statement = $connection->prepare($query);
            $statement->bindParam("email", $email);
            $statement->execute();


            $num = $statement->rowCount();

            if ($num > 0) {
                $row = $statement->fetch(PDO::FETCH_ASSOC);
                $id = base64_encode($row['users_id']);
                $name = $row['name'];
                $password2 = $row['password'];

                if (password_verify($password, $password2)) {
                    $secret_key = "todo-app-key";
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
                            "name" => $name,
                            "id" => $id,
                            "expireAt" => $expire_claim
                        )
                    );
                } else {
                    echo json_encode(array("message" => "Wrong password", "code" => 500));
                }
            } else {
                echo json_encode(array("message" => "Login failed", "code" => 401));
            }
        } catch (\Exception $e) {

            // Send error response
            echo json_encode([
                "message" => $e,
                "code" => 500
            ]);
        }
    }

    public static function deleteProfile($users_id)
    {
        // Establish database connection
        $datebaseService = new DatabaseService();
        $connection = $datebaseService->getConnection();

        // Prepare query
        $query = "
            DELETE  
                u, l, p
            FROM 
                users u
            LEFT JOIN
                lists l ON l.users_id = u.users_id
            LEFT JOIN
                products p ON p.lists_id = l.lists_id
            WHERE
                u.users_id = :users_id
            ";

        $statement = $connection->prepare($query);
        $statement->bindParam("users_id", $users_id);
        $result = $statement->execute();

        if ($result) {
            echo json_encode([
                "message" => $result,
                "code" => 200
            ]);
        } else {
            echo json_encode([
                "message" => $result,
                "code" => 500
            ]);
        }
    }
}
