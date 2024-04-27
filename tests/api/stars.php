<?php


if ($_SERVER['REQUEST_METHOD'] == 'POST')
{
    $stars = intval(file_get_contents("php://input"));
    for ($i = 0; $i < $stars; ++$i)
    {
        echo "*";
    }
}

?>