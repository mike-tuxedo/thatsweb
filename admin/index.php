<?php
session_start();
if (!isset($_SESSION['loggedin'])) {
    header('Location: /admin/login.php');
}

$url = "";
if (isset($_GET['url']) && strlen($_GET['url']) !== 0) {
    $url = $_GET['url'] . '/';
}

if ($url === 'index.html') {
    $url = '';
}

// Lade den Inhalt der index.html
$html = file_get_contents('../' . $url . 'index.html');
$editor = file_get_contents('./editorvanillajs.html');

if (!$html) {
    header('Location: /');
}

$pico = "<link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.conditional.cyan.min.css'>";
$styling = "<link rel='stylesheet' href='/admin/styles.css'>";
$reactiveHtml = "<script src='/admin/reactiveHtml.js'></script>";

$html = str_replace('<html', $styling.'<html  data-theme="light"', $html);
$html = str_replace('</head>', $styling.'</head>', $html);
$html = str_replace('</head>', $pico.'</head>', $html);
$html = str_replace('</head>', $reactiveHtml.'</head>', $html);
$html = str_replace('</body>', $editor.'</body>', $html);
$html = str_replace('</body>', '<input type="file" id="fileInput" style="display:none" accept="image/*"></body>', $html);
$html = preg_replace(
    '/(<li class="topnav-link"><a href=")\/?([^"]*?)\/?(")/',
    '$1?url=$2$3',
    $html
);

$path = "path = location.pathname";
$html = str_replace($path, "path = location.pathname.replace('admin', '')", $html);

// Ausgabe des geänderten HTML-Inhalts
echo $html;
?>
