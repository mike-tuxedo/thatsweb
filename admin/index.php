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

// Load the contents of index.html
$html = file_get_contents('../' . $url . 'index.html');
$editor = file_get_contents('./editor.html');

if (!$html) {
    header('Location: /');
}

$html = str_replace('<html', '<html  data-theme="dark"', $html);
$html = str_replace('</body>', $editor.'</body>', $html);
$html = preg_replace(
    '/(<li class="topnav-link"><a href=")\/?([^"]*?)\/?(")/',
    '$1?url=$2$3',
    $html
);

$path = "path = location.pathname";
$html = str_replace($path, "path = location.pathname.replace('admin', '')", $html);

// Push modified page to client
echo $html;
?>
