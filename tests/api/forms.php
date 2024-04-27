<?php

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET["type"])) {
        $type = $_GET["type"];
        if ($type == "search") {
            if (isset($_GET["q"])) {
                $q = $_GET["q"];
                echo "search results for <b>$q</b>:";
            }
        }
    } else {
        if (isset($_GET["username"])) {
            $username = $_GET["username"];
            if (isset($_GET["password"])) {
                $password = $_GET["password"];

                echo "<h3>Logged in successfully</h3>";
                echo "<div>";
                echo "<div>Hello <b>$username</b>!</div>";
                echo "<div>Your password <span style='color: red; font-weight: bold; font-size: 72px;'>$password</span> has been leaked(by the get method from the form).</div>";
                echo "</div>";
            }
        }
    }
} else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST["username"])) {
        $username = $_POST["username"];
        if (isset($_POST["password"])) {
            $password = $_POST["password"];

            echo "<h3>Logged in successfully</h3>";
            echo "<div>";
            echo "<div>Hello <b>$username</b>!</div>";
            echo "</div>";
        }
    }
}

?>