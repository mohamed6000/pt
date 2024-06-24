<?php

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    if (isset($_GET["type"])) {
        if ($_GET["type"] == "press") {
            echo "Button pressed by mouse";
        } else if ($_GET["type"] == "load") {
            echo date("s");
        } else if ($_GET["type"] == "comment") {
            if (isset($_GET["a"])) {
                echo $_GET["a"];
            } else {
                echo date("m:s");
            }
        }
    }
} else if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_GET)) {
        if ($_GET["type"] == "check") {
            if (isset($_POST["c"])) {
                echo "checked";
            }
        }
    } else {
        print_r($_POST);
        echo "<br>POST TEST";
    }
}

?>