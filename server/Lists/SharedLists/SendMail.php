<?php
// Include files
include_once '../../Config/Cors.php';
include_once '../../Config/Database.php';

// Establish database connection
$datebaseService = new DatabaseService();
$connection = $datebaseService->getConnection();

header('Content-Type: application/json');

try {
    // Get incoming data
    $data = json_decode(file_get_contents("php://input"));

    // Make sure needed data was given
    if(!isset($data->lists_id) || empty($data->lists_id) || !isset($data->mail) || empty($data->mail)){
         // Send error response
         echo json_encode([
            "message" => "Missing data",
            "code" => 500
        ]);
        exit();
    }

    $mail = $data->mail;
    $lists_id = base64_encode($data->lists_id);
    $name = $data->name;

      // Prepare query to get user
      $query = "
      SELECT 
          users_id
      FROM 
          users
      WHERE 
          email = :email 
      LIMIT 1";

    $statement = $connection->prepare($query);
    $statement->bindParam("email", $mail);
    $statement->execute();

    $user = $statement->fetchAll(PDO::FETCH_ASSOC);

    if(empty($user)){
         // Send error response
         echo json_encode([
            "message" => "User wasn't found",
            "code" => 404
        ]);
        exit();
    }
    
    // Encode user id
    $users_id = base64_encode($user[0]["users_id"]);
 

    // Link for the user to access
    // $link = "https://todos.dk/server/Lists/SharedLists/Create.php?lists_id=$lists_id&users_id=$users_id";
    $link = "https://todos.dk/join-list?lists_id=$lists_id&users_id=$users_id";

 
    // Subject for mail
    $subject = "Invitation til Todos liste";

    // Message in mail
    $message = "Du er blevet inviteret til en liste af $name.\r\n
                Klik på linket for at acceptere invitation.\r\n
                $link";

    // Prepare headers for mail
    $headers =  "From: Todos <info@todos.dk>\r\n";
    $headers .= "Reply-To: Todos <info@todos.dk>\r\n";
    $headers .= "Return-Path: Todos <info@todos.dk>\r\n";

    // Send mail
    if (mail($mail, $subject, $message, $headers) ) {
     // Send success response
     echo json_encode([
        "message" => "The mail was sent",
        "code" => 200
    ]);
    } else {
        // Send error response
        echo json_encode([
            "message" => "Couldn't send the mail",
            "code" => 500
        ]);
    }

} catch (\Exception $e) {
    // Send error response
    echo json_encode([
        "message" => "Something went wrong",
        "code" => 500
    ]);
}