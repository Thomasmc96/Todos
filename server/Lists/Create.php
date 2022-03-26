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

    if(empty($data->name)){
        http_response_code(500);

        // Send error response
        echo json_encode([
            "message" => "Name can't be empty"
        ]);
        exit(0);
    }

    // Data fields
    $name = $data->name;

    // Prepare query
    $query = "
        INSERT INTO 
            lists
        SET 
            name = :name
        ";

    $statement = $connection->prepare($query);

    // Bind data
    $statement->bindParam(":name", $name);


    // Execute statement
    if($statement->execute()){
        
        // Send success response
        echo json_encode([
            "message" => $name . " was created as a new list",
            "lists_id" => $connection->lastInsertId()
        ]);
    }else {
        http_response_code(500);

        // Send error response
        echo json_encode([
            "message" => "Unable to create list"
        ]);
    }
} catch(\Exception $e) {
    http_response_code(500);

     // Send error response
     echo json_encode([
         "message" => $e
     ]);
}