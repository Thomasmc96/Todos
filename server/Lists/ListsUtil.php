<?php
// Include files
include_once '../Config/Cors.php';
include_once '../Config/Database.php';

class ListsUtil{

    public static function getAllUsersByListId($lists_id){

        // Establish database connection
        $datebaseService = new DatabaseService();
        $connection = $datebaseService->getConnection();

        
        if(isset($lists_id) && !empty($lists_id)){

            $lists_id = $lists_id;

        } else {

            // Send error response
            return json_encode([
                "message" => "No lists_id was given",
                "code" => 500
            ]);
        }

        try {
            // Prepare query
            $query = "
                SELECT  
                   l.users_id, ls.users_id as shared_users
                FROM
                    lists l
                INNER JOIN
                    lists_shared ls ON ls.lists_id = l.lists_id
                WHERE
                    l.lists_id = " . $lists_id . "
            ";

            $statement = $connection->prepare($query);

            if($statement->execute()){

               return $statement->fetchAll();               

            } else {
                  // Send error response
             echo json_encode([
                "message" => "Couldn't get users on list",
                "code" => 500
            ]);
            }
        } catch(Exception $e){

             // Send error response
             echo json_encode([
                "message" => $e,
                "code" => 500
            ]);
        }

    }
}