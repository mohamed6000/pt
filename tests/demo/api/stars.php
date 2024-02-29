<?php


if ($_SERVER['REQUEST_METHOD'] == 'POST')
{
    $stars = intval(file_get_contents("php://input"));
    //echo "stars right?\n";
    for ($i = 0; $i < $stars; ++$i)
    {
        echo "*";
    }
}

?>