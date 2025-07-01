<?php
session_start();

if ($_POST['password'] === 'geheim') {
  $_SESSION['loggedin'] = true;
  header('Location: /admin');
  exit;
} else {
?>

  <html lang="en" class="dark">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.conditional.cyan.min.css'>
    <link rel="stylesheet" href="/admin/styles.css">

    <style>
      body {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    </style>
  </head>

  <body class="pico">
    <article>
      <header><h1>Login to that's web</h1></header>
      <main>
        <form action="/admin/login.php" method="post">
          <fieldset role="group">
            <input
              type="password"
              name="password"
              placeholder="****"
              aria-label="Password" />
            <input type="submit" value="Login" />
          </fieldset>
        </form>
      </main>
    </article>
  </body>

  </html>

<?php
}
?>