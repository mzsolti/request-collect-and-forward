<?php

$data = [];
if (isset($_POST) && count($_POST) > 0) {
    $data[] = [
        date('Y-m-d H:i:s'),
        'POST',
        http_build_query($_POST)
    ];
}
if (isset($_GET) && count($_GET) > 0) {
    $data[] = [
        date('Y-m-d H:i:s'),
        'GET',
        http_build_query($_GET)
    ];
}
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $input = file_get_contents('php://input');
    $data[] = [
        date('Y-m-d H:i:s'),
        'PUT',
        $input
    ];
}
$fp = fopen('request.log', 'a');
foreach ($data as $entry) {
    fputcsv($fp, $entry);
}

fclose($fp);
