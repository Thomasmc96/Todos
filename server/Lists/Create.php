<?php
// Include files
include_once '../Config/Cors.php';
include_once '../Config/Database.php';

// Establish database connection
$datebaseService = new DatabaseService();
$connection = $datebaseService->getConnection();

try{

    // Get incoming data
    $data = json_decode(file_get_contents("php://input"));

    if(empty($data->name) || empty($data->users_id)){

        // Send error response
        echo json_encode([
            "message" => "Values are missing",
            "code" => 500
        ]);
        exit(0);
    }

    // Data fields
    $name = $data->name;
    $users_id = base64_decode($data->users_id);

    // Prepare query
    $query = "
        INSERT INTO 
            lists
        SET 
            users_id = :users_id,
            name = :name
        ";

    $statement = $connection->prepare($query);

    // Bind data
    $statement->bindParam(":users_id", $users_id);
    $statement->bindParam(":name", $name);


    // Execute statement
    if($statement->execute()){
        
        // Send success response
        echo json_encode([
            "message" => $name . " was created as a new list",
            "lists_id" => base64_encode($connection->lastInsertId()),
            "code" => 200
        ]);
    }else {

        // Send error response
        echo json_encode([
            "message" => "Unable to create list",
            "code" => 500
        ]);
    }
} catch(\Exception $e) {

     // Send error response
     echo json_encode([
         "message" => $e,
         "code" => 500
     ]);
}