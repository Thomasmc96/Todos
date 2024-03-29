<?php
// Include files
include_once '../Config/Cors.php';
include_once '../Config/Database.php';


class NotificationsUtil {

    public static function create($type, $products_id, $users_id, $created_by){

        // Establish database connection
        $datebaseService = new DatabaseService();
        $connection = $datebaseService->getConnection();

        try{

            // Check data
            if (empty($products_id) || empty($users_id) || empty($created_by) || empty($type)) {

                // Send error response
                return json_encode([
                    "message" => "Values are missing",
                    "code" => 500
                ]);
            }

            // Prepare query
            $query = "
            INSERT INTO 
                notifications
            SET 
                type = :type,
                products_id = :products_id,
                users_id = :users_id,
                created_by = :created_by
            ";

            $statement = $connection->prepare($query);

            // Bind data
            $statement->bindParam(":type", $type);
            $statement->bindParam(":products_id", $products_id);
            $statement->bindParam(":users_id", $users_id);
            $statement->bindParam(":created_by", $created_by);

            // Execute statement
            if ($statement->execute()) {
                return 200;
                
            } else {

            return 200;
            }

        } catch(Exception $e){

           return 500;
        }

    }

    public static function update($users_id){

        // Establish database connection
        $datebaseService = new DatabaseService();
        $connection = $datebaseService->getConnection();

        try{

            if(!isset($users_id)){
                 // Send error response
                 return json_encode([
                    "message" => "Users id is missing",
                    "code" => 500
                ]);
            }

            // Prepare query
            $query = "
                UPDATE
                    notifications
                SET 
                    seen_by_user = 1
                WHERE
                    users_id = :users_id
            ";

            $statement = $connection->prepare($query);

            // Bind data
            $statement->bindParam(":users_id", $users_id);

            if($statement->execute()){
                echo json_encode([
                    "message" => "Notification updated",
                    "code" => 200
                ]);
            } else {
                echo json_encode([
                    "message" => "Couldn't update notification",
                    "code" => 500
                ]);
            }
        }
        catch(Exception $e){
            // Send error response
            echo json_encode([
                "message" => $e,
                "code" => 500
            ]);
        }
    }

    public static function getAllByUsersId($users_id){

        // Establish database connection
        $datebaseService = new DatabaseService();
        $connection = $datebaseService->getConnection();

        try{
            if(!isset($users_id)){
                // Send error response
                return json_encode([
                    "message" => "User id is missing",
                    "code" => 500
                ]);
            }

            // Prepare query
            $query = "
                SELECT
                    n.type, n.seen_by_user, n.created_date, u.name as created_by, p.name as products_name, IF(n.type = 'list_invitation', l2.name, l.name) AS lists_name, IF(n.type = 'list_invitation', l2.lists_id, l.lists_id) AS lists_id
                FROM
                    notifications n
                INNER JOIN
                    users u ON u.users_id = n.created_by
                LEFT JOIN
                    products p ON p.products_id = n.products_id
                LEFT JOIN
                    lists l ON l.lists_id = p.lists_id
                LEFT JOIN lists l2 ON
                    n.products_id = l2.lists_id
                WHERE
                    n.users_id = :users_id AND (n.created_date > NOW() - INTERVAL 2 DAY OR n.seen_by_user = 0)
                ORDER BY
                    n.created_date DESC
            ";

            $statement = $connection->prepare($query);
            
            // Bind data
            $statement->bindParam(":users_id", $users_id);

            if($statement->execute()){

                $notifications = $statement->fetchAll(PDO::FETCH_ASSOC);

                foreach($notifications as $pos => $value){
                    $notifications[$pos]['lists_id'] = base64_encode($notifications[$pos]['lists_id']);
                }

                echo json_encode([
                    "code" => 200,
                    "notifications" => $notifications
                ]);
            } else {
                echo json_encode([
                    "message" => "Couldn't update notification",
                    "code" => 500
                ]);
            }
        }
        catch(Exception $e){
            // Send error response
            echo json_encode([
                "message" => $e,
                "code" => 500
            ]);
        }
    }
}