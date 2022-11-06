<?php
// Include files
include_once '../Config/Cors.php';
include_once '../Config/Database.php';
include_once '../Notifications/NotificationsUtil.php';
include_once '../Lists/ListsUtil.php';

// Establish database connection
$datebaseService = new DatabaseService();
$connection = $datebaseService->getConnection();

// Get incoming data
$data = json_decode(file_get_contents("php://input"));

// Check products_id
if(empty($data->products_id) && empty($data->products)){
    
    // Send error response
    echo json_encode([
        "message" => "Please specify an products_id or an array or products",
        "code" => 500
    ]);

    exit(0);
}

$products = isset($data->products) && !empty($data->products) ? $data->products : [];
$users_id = isset($data->users_id) ? base64_decode($data->users_id) : null;
$lists_id = isset($data->lists_id_2) ? base64_decode($data->lists_id_2) : null;
$dontNotify = isset($data->dontNotify) ? true : false;

// Handle lots of products
if($products){
    // Loop through products
    foreach($products as $product){
        $error = false;
        // Update product
        if(!updateProduct($connection, $product, $users_id, $lists_id, $dontNotify)){
            $error = true;
        }
    }
    if($error){
        // Send error response
        echo json_encode([
            "message" => "Unable to update products",
            "code" => 500
        ]);
    } else {
        // Send success response
        echo json_encode([
            "message" => "The products was updated",
            "code" => 200
        ]);
    }
} else {
    // Update prodcut
    if(!updateProduct($connection, $data, $users_id, $lists_id, $dontNotify)){
        // Send error response
        echo json_encode([
            "message" => "Unable to update product",
            "code" => 500
        ]);
    }else {
            // Send success response
            echo json_encode([
            "message" => "The product was updated",
            "code" => 200
        ]);
    }
}

/**
 * @param \PDO $connection
 * @param mixed $product
 * @return bool
 */
function updateProduct($connection, $product, $users_id, $lists_id, $dontNotify = false){
    $error = false;
    
    //Prepare SET
    $set = "";
    // Check each value from the given data
    foreach($product as $key => $value){
        if($key != "products_id" && $key != "lists_id" && $key != "users_id" && $key != "lists_id_2" && $key != "dontNotify"){            
            $set .= $key . " = :" . $key . ", ";
        }
    }
    $set = substr($set, 0, -2);

    // Data fields
    $products_id = $product->products_id;

    // Set date_completed depending of completed
    if(isset($product->completed)){
        if($product->completed == "1"){
            $set .= ", date_completed = NOW()";
        } else if($product->completed == "0"){
            $set .= ", date_completed = NULL";
        }
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
    foreach($product as $key => $value){
        if($key != "products_id" && $key != "lists_id" && $key != "users_id" && $key != "lists_id_2" && $key != "dontNotify"){
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
    if(!$statement->execute()){
         // Send success response
         echo json_encode([
            "message" => $connection->errorInfo(),
            "code" => 600
        ]);
        $error = true;
    }

    // Check if we should notify
    if(!isset($dontNotify) || !$dontNotify){

        $users = ListsUtil::getAllUsersByListId($lists_id);

        $enum = isset($product->completed) && $product->completed == "1" ? "complete" : "update";

        if(is_array($users)){
            $i = 0;
            foreach($users as $user){
                if($user['users_id'] == $users_id){
                    NotificationsUtil::create($enum, $products_id, $user["shared_users"], $users_id);
                } else {
                    if($i === 0){
                        NotificationsUtil::create($enum, $products_id, $user["users_id"], $users_id);
                        $i++;
                    }
                    if($users_id != $user['shared_users']){
                        NotificationsUtil::create($enum, $products_id, $user["shared_users"], $users_id);
                    }
                }
            }
        }
    }

    return $error === false;
}