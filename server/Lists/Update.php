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

    
    //Prepare SET
    $set = "";
    // Check each value from the given data
    foreach($data as $key => $value){
        if($key != "lists_id"){
            // Add quotes to strings
            // $value = !is_numeric($value) ? "'" . $value . "'" : $value;
            
            $set .= $key . " = :" . $key . ", ";
        }
    }
    $set = substr($set, 0, -2);

    // Data fields
    $lists_id = $data->lists_id;

    // Prepare query
    $query = "
        UPDATE
            lists
        SET 
            ". $set ."
        WHERE
            lists_id = :lists_id
        ";
    $statement = $connection->prepare($query);

    // Bind data
    foreach($data as $key => $value){
        if($key != "lists_id"){
            $key = ":" . $key;
            if(!is_numeric($value)){
                $statement->bindValue($key, $value, PDO::PARAM_STR);
            } else {
                $statement->bindValue($key, $value, PDO::PARAM_INT);
            }
        }
    }
    $statement->bindParam(":lists_id", $lists_id);

    // Execute statement
    if($statement->execute()){
        
        // Send success response
        echo json_encode([
            "message" => "The list was updated",
            "code" => 200
        ]);
    }else {

        // Send error response
        echo json_encode([
            "message" => "Unable to update list",
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