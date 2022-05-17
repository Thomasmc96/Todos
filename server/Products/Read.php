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

  
    // Prepare WHERE
    $where = "1";

    // Fetch only one list if lists_id is given
    if(isset($_GET['lists_id']) && !empty($_GET['lists_id'])){

        $lists_id = $_GET['lists_id'];

        $where .= " AND l.lists_id = " . $lists_id;

    } else {
          // Send error response
          echo json_encode([
              "message" => "No lists_id was given",
              "code" => 500
          ]);
      
          exit(0);
    }

    // Prepare query
    $query = "
        SELECT  
            p.products_id, p.name, p.completed, p.date_completed, l.name as list_name, l.users_id, ls.users_id as shared_user
        FROM
            lists l
        LEFT JOIN
            products p ON p.lists_id = l.lists_id
        LEFT JOIN
            lists_shared ls on ls.lists_id = l.lists_id
        WHERE
            ". $where ."
        ";

    $statement = $connection->prepare($query);

 
    // Execute statement
    if($statement->execute()){
        
        $listName = "";
        $products = [];
        
        // Loop through rows 
        while($row = $statement->fetch(PDO::FETCH_ASSOC)){
            $listName = $row['list_name'];
            $usersId = base64_encode($row['users_id']);

            // Set shared users
            $sharedUsers = [];
            if(!in_array($row['shared_user'], $sharedUsers)){
                $sharedUsers[] = base64_encode($row['shared_user']);
            }
            

            if(!empty($row['products_id'])){
                // If uncompleted or if completed in less than 30 mins ago
                if($row['completed'] == "0" || strtotime(date($row['date_completed'])) > strtotime("-30 minutes") ){
                    $products[] = [
                        "products_id" => $row['products_id'],
                        "name" => $row['name'],
                        "completed" => $row['completed'],
                    ];
                 }
            }
        }

        // Send success response
        echo json_encode(["list_name" => $listName, "users_id" => $usersId, "products" => $products, "shared_users" => $sharedUsers, "code" => 200]);
    }else {

        // Send error response
        echo json_encode([
            "message" => "Unable to get products",
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