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
            "message" => "No lists_id was given",
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
            lists l ON l.users_id = u.users_id AND l.lists_id = :lists_id
        LEFT JOIN
            lists_shared ls ON ls.users_id = u.users_id AND ls.lists_id = :lists_id
        WHERE
            l.lists_id = :lists_id OR ls.lists_id = :lists_id
        ";

    $statement = $connection->prepare($query);

    // Bind variables
    $statement->bindParam(":lists_id", $lists_id);

    // Execute statement
    if ($statement->execute()) {

        // Send success response
        $members = $statement->fetchAll(PDO::FETCH_ASSOC);

        foreach ($members as $pos => $member) {
            if (!empty($member['lists_shared_id'])) {
                $members[$pos]['owner'] = 0;
            } else {
                $members[$pos]['owner'] = 1;
            }
            // Unset lists_shared_id key
            unset($members[$pos]['lists_shared_id']);
        }

        echo json_encode(["members" => $members, "code" => 200]);
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
