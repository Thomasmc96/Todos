<?php
// Include files
include_once '../Config/Cors.php';
include_once '../Config/Database.php';

// Establish database connection
$datebaseService = new DatabaseService();
$connection = $datebaseService->getConnection();

header('Content-Type: application/json');

try{

    // Get incoming data
    $data = json_decode(file_get_contents("php://input"));

    
    // Prepare WHERE
    $where = "1";

    // Fetch only one list if lists_id is given
    if(isset($_GET['lists_id']) && !empty($_GET['lists_id'])){

        $lists_id = $_GET['lists_id'];

        $where .= " AND lists_id = " . $lists_id;

    }

    // Fetch by users_id
    if(isset($_GET['users_id']) && !empty($_GET['users_id'])){

        $users_id = base64_decode($_GET['users_id']);

        $where .= " AND users_id = " . $users_id;
    }else {
        if(empty($lists_id)){
            // Send error response
            echo json_encode([
                "message" => "No users_id was given",
                "code" => 500
            ]);
            exit();
        }
    }

    // Prepare query
    $query = "
        SELECT  
            *
        FROM
            lists
        WHERE
            ". $where ."
        ";

    $statement = $connection->prepare($query);

 
    // Execute statement
    if($statement->execute()){
        
        // Send success response
        $lists = $statement->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($lists);
    }else {

        // Send error response
        echo json_encode([
            "message" => "Unable to get list",
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