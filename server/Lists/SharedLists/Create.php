<?php
// Include files
include_once '../../Config/Cors.php';
include_once '../../Config/Database.php';

// Establish database connection
$datebaseService = new DatabaseService();
$connection = $datebaseService->getConnection();

header('Content-Type: application/json');

try{

    // Get incoming data
    $data = json_decode(file_get_contents("php://input"));

    // Fetch by users_id
    if(!isset($_GET['users_id']) && empty($_GET['users_id']) || !isset($_GET['lists_id']) && empty($_GET['lists_id'])){
         // Send error response
         echo json_encode([
            "message" => "Missing data",
            "code" => 500
        ]);
        exit();
    }


    // Set variables
    $users_id = $_GET['users_id'];
    $lists_id = $_GET['lists_id'];
    
    // Prepare query
    $query = "
        INSERT INTO 
            lists_shared
        SET 
            users_id = :users_id,
            lists_id = :lists_id
        ";

    $statement = $connection->prepare($query);

    // Bind data
    $statement->bindParam(":users_id", $users_id);
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
            "message" => "Unable to share list",
            "code" => 500
        ]);
    }
}
    catch(\Exception $e){
    // Send error response
    echo json_encode([
        "message" => "Something went wrong",
        "code" => 500
    ]);
}