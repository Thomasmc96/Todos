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

    if(empty($data->lists_id)){
        
        // Send error response
        http_response_code(500);
        echo json_encode([
            "message" => "lists_id can't be empty"
        ]);
    
        exit(0);
    }

    // Data fields
    $lists_id = $data->lists_id;

    // Prepare query
    $query = "
        DELETE FROM 
            lists
        WHERE 
            lists_id = :lists_id
        ";

    $statement = $connection->prepare($query);

    // Bind data
    $statement->bindParam(":lists_id", $lists_id);


    // Execute statement
    if($statement->execute()){
        
        // Send success response
        http_response_code(200);
        echo json_encode([
            "message" => "Success"
        ]);
    }else {

        // Send error response
        http_response_code(500);
        echo json_encode([
            "message" => "Unable to delete list"
        ]);
    }
} catch(\Exception $e) {

     // Send error response
     http_response_code(500);
     echo json_encode([
         "message" => $e
     ]);
}