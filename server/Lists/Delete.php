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
        echo json_encode([
            "message" => "lists_id can't be empty",
            "code" => 500
        ]);
    
        exit(0);
    }

    // Data fields
    $lists_id = $data->lists_id;

    // Prepare query
    $query = "
        DELETE 
            l, p 
        FROM 
            lists l
        LEFT JOIN 
            products p ON p.lists_id = l.lists_id
        WHERE 
            l.lists_id = :lists_id
        ";

    $statement = $connection->prepare($query);

    // Bind data
    $statement->bindParam(":lists_id", $lists_id);


    // Execute statement
    if($statement->execute()){
        
        // Send success response
        echo json_encode([
            "message" => "Success",
            "code" => 200
        ]);
    }else {

        // Send error response
        echo json_encode([
            "message" => "Unable to delete list",
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