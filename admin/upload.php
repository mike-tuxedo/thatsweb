<?php
session_start();
if (!isset($_SESSION['loggedin'])) {
    http_response_code(403);
    exit('Nicht eingeloggt');
}

if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = '../media/';
    if (!is_dir($uploadDir)) mkdir($uploadDir);

    $filename = basename($_FILES['image']['name']);
    $targetPath = $uploadDir . time() . '_' . $filename;

    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
        echo $targetPath;
    } else {
        http_response_code(500);
        echo 'Fehler beim Speichern';
    }
} else {
    http_response_code(400);
    echo 'Kein Bild';
}
