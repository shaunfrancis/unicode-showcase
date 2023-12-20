<?php
    $data = json_decode(file_get_contents('php://input'), true);
    include("credentials.php");

    if(!isset($data["image"])){
        http_response_code(400);
        die("Bad Request");
    }

    if(!isset($data["access_token"]) || $data["access_token"] != $ACCESS_TOKEN || !in_array($_SERVER["REMOTE_ADDR"], $WHITELISTED_IPS)){
        http_response_code(403);
        die("Forbidden");
    }

    $image = base64_decode($data["image"]);
    if(!image){
        http_response_code(400);
        die("Bad Request");
    }

    $success = file_put_contents("next_image.jpg", $image);
    if(!success){
        http_response_code(500);
        die("Internal Server Error");
    }
    else{
        echo "Success";
    }
?>