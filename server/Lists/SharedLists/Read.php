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

    
    // Prepare WHERE
    // $where = "1";

    // Fetch by users_id
    if(isset($_GET['users_id']) && !empty($_GET['users_id'])){

        $users_id = base64_decode($_GET['users_id']);

        // $where .= " AND users_id = " . $users_id;
    }else {
        // Send error response
        echo json_encode([
            "message" => "No users_id was given",
            "code" => 500
        ]);
        exit();
        
    }

    // Prepare query
    $query = "
        SELECT  
            l.*, u.name as users_name
        FROM
            lists_shared sl
        INNER JOIN
            lists l on l.lists_id = sl.lists_id
        INNER JOIN
            users u ON u.users_id = l.users_id
        WHERE
            sl.users_id = :users_id
        ";

    $statement = $connection->prepare($query);

    // Bind variables
    $statement->bindParam(":users_id", $users_id);
 
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