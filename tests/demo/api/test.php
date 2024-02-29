<?php


if ($_SERVER['REQUEST_METHOD'] == 'GET')
{
    echo "<b>Hello from the server.</b>";
}
else if ($_SERVER['REQUEST_METHOD'] == 'POST')
{
    $post = json_decode(file_get_contents("php://input"));
    $price = floatval($post->price);

    if ($price > 0)
    {
        echo "Your purchase cost <b>$price</b>$";
    }
    else
    {
        echo "Your purchase cost nothing!";
    }
}

?>