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

    if(empty($data->title) || empty($data->lists_id) ) {

        // Send error response
        echo json_encode([
            "message" => "Values are missing",
            "code" => 500
        ]);
        exit(0);
    }

    // Data fields
    $title = $data->title;
    $lists_id = base64_decode($data->lists_id);

    // Prepare query
    $query = "
        UPDATE 
            lists
        SET 
            name = :name
        WHERE 
            lists_id = :lists_id
        ";

    $statement = $connection->prepare($query);

    // Bind data
    $statement->bindParam(":lists_id", $lists_id);
    $statement->bindParam(":name", $title);


    // Execute statement
    if($statement->execute()){
        
        // Send success response
        echo json_encode([
            "message" => $title . " is the new list title",
            "lists_id" => base64_encode($connection->lastInsertId()),
            "code" => 200
        ]);
    }else {

        // Send error response
        echo json_encode([
            "message" => "Unable to change list title",
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