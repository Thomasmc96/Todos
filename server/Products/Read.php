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
          http_response_code(500);
          echo json_encode([
              "message" => "No lists_id was given"
          ]);
      
          exit(0);
    }

    // Prepare query
    $query = "
        SELECT  
            p.products_id, p.name, p.completed, l.name as list_name
        FROM
            lists l
        LEFT JOIN
            products p ON p.lists_id = l.lists_id
        WHERE
            ". $where ."
        ";

    $statement = $connection->prepare($query);

 
    // Execute statement
    if($statement->execute()){
        
        // Send success response
        http_response_code(200);


        $listName = "";
        $products = [];
        while($row = $statement->fetch(PDO::FETCH_ASSOC)){
            $listName = $row['list_name'];

            if(!empty($row['products_id'])){
                $products[] = [
                    "products_id" => $row['products_id'],
                    "name" => $row['name'],
                    "completed" => $row['completed']
                ];
            }
        }

        echo json_encode(["list_name" => $listName, "products" => $products]);
    }else {

        // Send error response
        http_response_code(500);
        echo json_encode([
            "message" => "Unable to get products"
        ]);
    }
} catch(\Exception $e) {

     // Send error response
     http_response_code(500);
     echo json_encode([
         "message" => $e
     ]);
}