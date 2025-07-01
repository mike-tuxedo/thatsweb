<?php
session_start();
if (!isset($_SESSION['loggedin'])) {
    http_response_code(403);
    exit('Nicht eingeloggt');
}

// JSON-Daten einlesen
$data = json_decode(file_get_contents('php://input'), true);

// Validieren
if (!isset($data['name']) || !isset($data['content'])) {
    http_response_code(400);
    exit('Ungültige Daten');
}

// Nur erlaubte Dateinamen zulassen
$allowed = ['main-content', 'top-content'];
if (!in_array($data['name'], $allowed)) {
    http_response_code(400);
    exit('Nicht erlaubter Dateiname');
}

// Speichern
$filename = '../' . $data['dir'] . '/' . $data['name'] . '.html';

if (file_put_contents($filename, $data['content']) !== false) {
    echo "Gespeichert in {$filename}";
} else {
    http_response_code(500);
    echo "Fehler beim Speichern";
}
