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

    if(empty($data->products_id)){
        
        // Send error response
        http_response_code(500);
        echo json_encode([
            "message" => "products_id can't be empty"
        ]);
    
        exit(0);
    }

    
    //Prepare SET
    $set = "";
    // Check each value from the given data
    foreach($data as $key => $value){
        if($key != "products_id" || $key != "lists_id"){            
            $set .= $key . " = :" . $key . ", ";
        }
    }
    $set = substr($set, 0, -2);

    // Data fields
    $products_id = $data->products_id;

    // Prepare query
    $query = "
        UPDATE
            products
        SET 
            ". $set ."
        WHERE
            products_id = :products_id
        ";
    $statement = $connection->prepare($query);

    // Bind data
    foreach($data as $key => $value){
        if($key != "products_id" || $key != "lists_id"){
            $key = ":" . $key;
            if(!is_numeric($value)){
                $statement->bindValue($key, $value, PDO::PARAM_STR);
            } else {
                $statement->bindValue($key, $value, PDO::PARAM_INT);
            }
        }
    }
    $statement->bindParam(":products_id", $products_id);

    // Execute statement
    if($statement->execute()){
        
        // Send success response
        http_response_code(200);
        echo json_encode([
            "message" => "The product was updated"
        ]);
    }else {

        // Send error response
        http_response_code(500);
        echo json_encode([
            "message" => "Unable to update product"
        ]);
    }
} catch(\Exception $e) {

     // Send error response
     http_response_code(500);
     echo json_encode([
         "message" => $e
     ]);
}