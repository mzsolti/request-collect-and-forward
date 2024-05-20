<?php

header('Access-Control-Allow-Origin: http://localhost:3000');
//header('Access-Control-Allow-Origin: *');
//
// // Specify which request methods are allowed
header('Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS');
//
// // Additional headers which may be sent along with the CORS request
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Origin');
//
// // Set the age to 1 day to improve speed/caching.
header('Access-Control-Max-Age: 86400');
//
// // Exit early so the page isn't fully loaded for options requests
if (strtolower($_SERVER['REQUEST_METHOD']) == 'options') {
    exit();
}
if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest') {
    $_POST = json_decode(file_get_contents('php://input'), true);
}
$action = $_POST['action'] ?? '';
if ($action == "send") {
    //need to send a post or get
    $data = ['msg' => 'Sent request', 'response' => '', 'status' => ''];
    $req = $_POST['irequest'];
    $ch = curl_init();
    // Set a timeout for the cURL request
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    // return the response from the server as a string instead of outputting it directly
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    // avoid following redirects, if any
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
    //we want header data
    //curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    if ($req['type'] == 'GET') {
        curl_setopt($ch, CURLOPT_URL, $_POST['url'] . '?' . $req['params']);
    } elseif (
        $req['type'] == 'POST'
||
        $req['type'] == 'PUT'
    ) {
        curl_setopt($ch, CURLOPT_URL, $_POST['url']);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $req['params']);
    }
    if ($req['type'] == 'PUT') {
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
    }
    // Execute the cURL request and capture the response
    $response = curl_exec($ch);
    // Check for cURL errors
    if (curl_errno($ch)) {
        $data['response'] = 'Curl error: ' . curl_error($ch);
    } else {
        $data['status'] = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        // Decode JSON response if it is a JSON string
        $decodedResponse = json_decode($response, true);
        // Check if decoding was successful
        if ($decodedResponse !== null) {
            // Output the JSON response to the UI
            $data['response'] = json_encode($decodedResponse, JSON_PRETTY_PRINT);
        } else {
            // If the response is not valid JSON, echo it as plain text
            $data['response'] = $response;
        }
    }
    // Close cURL session
    curl_close($ch);
} else {
    $file = 'request.log';
    if (isset($_POST['loadFromExternalRequestLog']) && $_POST['loadFromExternalRequestLog'] == true) {
        if (ini_get('allow_url_fopen')) {
            $file = $_POST['externalRequestLog'];
        } else {
            file_put_contents('request.log', file_get_contents($_POST['externalRequestLog']));
        }
    }
    $data = [];
    $row = 0;
    if (($handle = fopen($file, "r")) !== false) {
        while (($line = fgetcsv($handle, 10000, ",")) !== false) {
            $data[$row] = [
                'created' => $line[0],
                'type' => $line[1],
                'params' => $line[2],
            ];
            $row++;
        }
        fclose($handle);
    }
}
header('Content-type: application/json');
echo json_encode($data);
