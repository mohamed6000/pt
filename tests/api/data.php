<?php

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['type'])) {
        $type = $_GET['type'];
        if ($type == "replaceable") {
            echo "<button pt-get='/tests/api/data.php?type=update' pt-replace='outerHTML'>Update</button>";
        } else if ($type == "update") {
            echo "<p>Database updated!</p>";
        }
    }
} else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_GET['type'])) {
        $type = $_GET['type'];
        if ($type == "select") {
            if (isset($_POST["s"])) {
                echo $_POST["s"];
            }
        }
    }
}

?>