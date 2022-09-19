<?php
// Include files
include_once '../Config/Cors.php';
include_once '../Config/Database.php';
include_once "./UsersUtil.php";

// Establish database connection
$datebaseService = new DatabaseService();
$connection = $datebaseService->getConnection();

try {

    // Get incoming data
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->name) || empty($data->email) || empty($data->password)) {

        // Send error response
        echo json_encode([
            "message" => "Values are missing",
            "code" => 500
        ]);
        exit(0);
    }

    // Data fields
    $name = $data->name;
    $email = $data->email;
    $password = password_hash($data->password, PASSWORD_BCRYPT);

    // Prepare query
    $query = "
        INSERT INTO 
            users
        SET 
            name = :name,
            email = :email,
            password = :password
        ";

    $statement = $connection->prepare($query);

    // Bind data
    $statement->bindParam(":name", $name);
    $statement->bindParam(":email", $email);
    $statement->bindParam(":password", $password);


    // Execute statement
    if ($statement->execute()) {
        // Login
        UsersUtil::login($email, $data->password);

        // // Send success response
        // echo json_encode([
        //     "message" => "The new user was created",
        //     "users_id" => $connection->lastInsertId()
        // ]);
    } else {

        // Send error response
        echo json_encode([
            "message" => "Unable to create user",
            "code" => 500
        ]);
    }
} catch (\Exception $e) {

    // Send error response
    echo json_encode([
        "message" => $e,
        "code" => 500
    ]);
}
