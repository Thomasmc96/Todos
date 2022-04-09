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

    if(empty($data->name) || empty($data->lists_id)){
        
        // Send error response
        http_response_code(500);
        echo json_encode([
            "message" => "Values are missing"
        ]);
    
        exit(0);
    }

    // Data fields
    $name = $data->name;
    $lists_id = $data->lists_id;

    // Prepare query
    $query = "
        INSERT INTO 
            products
        SET 
            name = :name,
            lists_id = :lists_id
        ";

    $statement = $connection->prepare($query);

    // Bind data
    $statement->bindParam(":name", $name);
    $statement->bindParam(":lists_id", $lists_id);


    // Execute statement
    if($statement->execute()){
        
        // Send success response
        http_response_code(200);
        echo json_encode([
            "message" => $name . " was created as a new product",
            "products_id" => $connection->lastInsertId()
        ]);
    }else {

        // Send error response
        http_response_code(500);
        echo json_encode([
            "message" => "Unable to create product"
        ]);
    }
} catch(\Exception $e) {

     // Send error response
     http_response_code(500);
     echo json_encode([
         "message" => $e
     ]);
}