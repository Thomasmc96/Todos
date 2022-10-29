<?php
// Include files
include_once '../Config/Cors.php';
include_once '../Config/Database.php';
include_once '../Lists/ListsUtil.php';
include_once '../Notifications/NotificationsUtil.php';

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
    $users_id = base64_decode($data->users_id);

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

        $products_id = $connection->lastInsertId();
        
        // Send success response
        echo json_encode([
            "message" => $name . " was created as a new product",
            "products_id" => $products_id,
            "code" => 200
        ]);

        $users = ListsUtil::getAllUsersByListId($lists_id);

        if(is_array($users)){
            $i = 0;
            foreach($users as $user){
                if($user['users_id'] == $users_id){
                    NotificationsUtil::create("create", $products_id, $user["shared_users"], $users_id);
                } else {
                    if($i === 0){
                        NotificationsUtil::create("create", $products_id, $user["users_id"], $users_id);
                        $i++;
                    }
                    if($users_id != $user['shared_users']){
                        NotificationsUtil::create("create", $products_id, $user["shared_users"], $users_id);
                    }
                }
            }
        }

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