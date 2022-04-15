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

    // Check products_id
    if(empty($data->products_id)){
        
        // Send error response
        echo json_encode([
            "message" => "products_id can't be empty",
            "code" => 500
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

    // Set date_completed depending of completed
    if($data->completed == "1"){
        $set .= ", date_completed = NOW()";
    } else if($data->completed == "0"){
        $set .= ", date_completed = NULL";
    }

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
        echo json_encode([
            "message" => "The product was updated",
            "code" => 200
        ]);
    }else {

        // Send error response
        echo json_encode([
            "message" => "Unable to update product",
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