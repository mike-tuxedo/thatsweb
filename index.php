<!DOCTYPE html>
<html lang="de">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meine Seite mit HTML-Komponenten</title>
    <link rel="icon" type="image/x-icon" href="/favicon.ico">

    <link rel="stylesheet" href="/assets/init-styles.css">
    <link rel='stylesheet' href='/assets/pico.cyan.min.css'>
    <script src="/assets/int-script.js"></script>

    <script>
        // Funktion zum Laden der HTML-Komponenten
        async function loadComponent(url, containerId) {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP-Fehler! Status: ${response.status}`);
                }
                const html = await response.text();
                document.getElementById(containerId).innerHTML += html;
            } catch (error) {
                console.error(`Fehler beim Laden von ${url}:`, error);
                document.getElementById(containerId).innerHTML = `<p>Fehler beim Laden der Komponente: ${url}</p>`;
            }
        }

        const contentLoaded = new Event('contentLoaded');
        // Alle Komponenten laden, wenn die Seite geladen ist
        document.addEventListener('DOMContentLoaded', async function() {
            const path = location.pathname !== '/' ? location.pathname : '/index';
            await loadComponent(`${path}/main-content.html`, 'main-container');
            await loadComponent('/footer-content.html', 'footer-container');
            document.dispatchEvent(contentLoaded);
        });
    </script>

    <!-- Optional SWIPER -->
    <script src="/assets/swiper-element-bundle.min.js" async></script>
</head>

<body>
<div class="background">
   <span></span>
   <span></span>
   <span></span>
   <span></span>
   <span></span>
   <span></span>
   <span></span>
   <span></span>
   <span></span>
   <span></span>
   <span></span>
   <span></span>
   <span></span>
   <span></span>
</div>
    <header id="header-container">
        <?php include('header-content.html'); ?>
    </header>

    <main id="content-container">
        <div id="top-container" class="content-full">
            <?php
            $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
            if ($path === '/') {
                $fullPath = $_SERVER['DOCUMENT_ROOT'] . '/index/top-content.html';
            } else {
                $topContentPath = $path . '/top-content.html';
                $fullPath = $_SERVER['DOCUMENT_ROOT'] . $topContentPath;
            }
            if (file_exists($fullPath)) {
                include $fullPath;
            }
            ?>
        </div>
        <div id="main-container" class="content-md"></div>
    </main>

    <footer id="footer-container"></footer>

    <link rel="stylesheet" href="/assets/main-styles.css" media="print" onload="this.media='all'">
    <script src="/assets/main-script.js" async></script>
</body>

</html>