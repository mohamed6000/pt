<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // print_r($_SERVER);
    // print_r(file_get_contents("php://input"));
    // echo "<br>";
    // var_dump($_POST);
    // echo "<br>";
    // print_r($_REQUEST);
    
    if (isset($_GET['type'])) {
        $type = $_GET['type'];
        if ($type == "simple") {
            echo "<p>Simple post response.</p>";
        } else if ($type == "medium") {
            $name = $_POST["my_name"];
            echo "<div>Hello <b>$name</b>.</div>";
        } else if ($type == "comment") {
            $comment = $_POST["my_comment"];
            echo "<div><b>anonym user</b> says: $comment</div>";
        }
    }
}

?>