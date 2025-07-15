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
                var scripts = new DOMParser().parseFromString(html, 'text/html').querySelectorAll("SCRIPT");
                var i = 0;
                var j = scripts.length;
                while (i < j) {
                    var newScript = document.createElement("SCRIPT");
                    scripts[i].src ? newScript.src = scripts[i].src : newScript.innerHTML = scripts[i].innerHTML;
                    document.head.appendChild(newScript);
                    i++;
                }
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
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path id="morphPath" class="morph-path" fill="currentColor"  d="M32.5,-65.4C38.7,-52.6,38.2,-37.2,40.9,-25.8C43.5,-14.5,49.4,-7.2,51.3,1.1C53.2,9.5,51.2,18.9,49.7,32.4C48.3,45.9,47.5,63.4,39.3,74.3C31.2,85.1,15.6,89.3,2.7,84.6C-10.2,79.9,-20.3,66.4,-26.8,54.5C-33.3,42.7,-36,32.5,-46.7,23.7C-57.4,14.9,-76,7.5,-79.4,-2C-82.9,-11.4,-71.1,-22.8,-60.5,-31.9C-50,-40.9,-40.6,-47.5,-30.7,-58.2C-20.8,-69,-10.4,-83.8,1.3,-86.2C13.1,-88.5,26.2,-78.3,32.5,-65.4Z"  transform="translate(100 100)" />
    </svg>

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
        <div id="main-container" class="content-full"></div>
    </main>

    <footer id="footer-container"></footer>

    <link rel="stylesheet" href="/assets/main-styles.css" media="print" onload="this.media='all'">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/flubber/0.4.2/flubber.min.js"></script>
    <script src="/assets/main-script.js" async></script>
</body>

</html>