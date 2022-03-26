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
        http_response_code(200);

        $lists = $statement->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($lists);
    }else {

        // Send error response
        http_response_code(500);
        echo json_encode([
            "message" => "Unable to get list"
        ]);
    }
} catch(\Exception $e) {

     // Send error response
     http_response_code(500);
     echo json_encode([
         "message" => $e
     ]);
}