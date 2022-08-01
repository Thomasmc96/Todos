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
        echo json_encode([
            "message" => "Values are missing",
            "code" => 500
        ]);
    
        exit(0);
    }

    // Data fields
    $name = $data->name;
    $lists_id = $data->lists_id;
    $sort_index = isset($data->sort_index) && !empty($data->sort_index) ? $data->sort_index : null;

    // Prepare query
    $query = "
        INSERT INTO 
            products
        SET 
            name = :name,
            lists_id = :lists_id,
            sort_index = :sort_index
        ";

    $statement = $connection->prepare($query);

    // Bind data
    $statement->bindParam(":name", $name);
    $statement->bindParam(":lists_id", $lists_id);
    $statement->bindParam(":sort_index", $sort_index);


    // Execute statement
    if($statement->execute()){
        
        // Send success response
        echo json_encode([
            "message" => $name . " was created as a new product",
            "products_id" => $connection->lastInsertId(),
            "code" => 200
        ]);
    }else {

        // Send error response
        echo json_encode([
            "message" => "Unable to create product",
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