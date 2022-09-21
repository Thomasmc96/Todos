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

    // Fetch by users_id
    if (isset($_GET['lists_id']) && !empty($_GET['lists_id'])) {

        $lists_id = $_GET['lists_id'];
    } else {
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
            u.name, ls.lists_shared_id
        FROM 
            users u
        LEFT JOIN
            lists l ON l.users_id = u.users_id
        LEFT JOIN
            lists_shared ls ON ls.users_id = u.users_id
        WHERE
            l.lists_id = :lists_id OR ls.lists_id = :lists_id;
        ";

    $statement = $connection->prepare($query);

    // Bind variables
    $statement->bindParam(":lists_id", $lists_id);

    // Execute statement
    if ($statement->execute()) {

        // Send success response
        $lists = $statement->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($lists);
    } else {

        // Send error response
        echo json_encode([
            "message" => "Unable to get list",
            "code" => 500
        ]);
    }
} catch (\Exception $e) {

    // Send error response
    echo json_encode([
        "message" => $e,
        "code" => 500
    ]);
}
