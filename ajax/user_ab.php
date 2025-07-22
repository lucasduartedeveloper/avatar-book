<?php include ("config/db_aiven.php")?>
<?php
//header("Content-Type: application/json; charset=utf-8");
$sql ="";
try {
    $remote_addr = $_SERVER["REMOTE_ADDR"];
    $forwarded =  $_SERVER["HTTP_X_FORWARDED_FOR"];

    if (!empty($_POST["action"]) && 
        $_POST["action"] == "update-user") {

        $user = $_POST["user"];

        $id = htmlspecialchars($user["id"]);
        $name = 
        htmlspecialchars($user["name"]);
        $body = $user["body"];
        $hair = $user["hair"];
        $eye = $user["eye"];
        $nose = $user["nose"];
        $mouth = $user["mouth"];
        $likes = $user["likes"];

        $sql = "SELECT id, name, body, hair, ".
        "eye, nose, mouth, likes 
        FROM users_ab WHERE name='".$name."';";

        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $rowCount = $stmt->rowCount();

        if ($rowCount == 0) {
            $sql = "INSERT INTO users_ab (
                name,
                body,
                hair,
                eye,
                nose,
                mouth,
                likes
             ) VALUES ('".
                $name."',".
                $body.",".
                $hair.",".
                $eye.",".
                $nose.",".
                $mouth.",".
                $likes.
            ");";

            $stmt = $pdo->prepare($sql);
            $stmt->execute();
        }
        else {
            $sql = 
            "UPDATE users_ab SET ".
            "body = ".$body.
            ", hair = ".$hair.
            ", eye= ".$eye.
            ", nose = ".$nose.
            ", mouth = ".$mouth.
            ", likes = ".$likes.
            " WHERE name = '".$name."';";

            $stmt = $pdo->prepare($sql);
            $stmt->execute();
        }
    }
    else if (!empty($_POST["action"]) && 
        $_POST["action"] == "update-likes") {

        $user = $_POST["user"];

        $id = htmlspecialchars($user["id"]);
        $name = 
        htmlspecialchars($user["name"]);
        $likes = $user["likes"];

        $sql = 
        "UPDATE users_ab SET ".
        "likes = ".$likes.
        " WHERE name = '".$name."';";

        $stmt = $pdo->prepare($sql);
        $stmt->execute();
    }
    else if (!empty($_GET["name"])) {
        $name = htmlspecialchars($_GET["name"]);

        $sql = "SELECT id, name, body, hair, ".
        "eye, nose, mouth, likes 
        FROM users_ab WHERE name='".$name."';";

        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $details = $stmt->fetchAll(); 

        echo json_encode($details);

        //echo $sql;
    }
    else {
        $sql = "SELECT id, name, body, hair, eye, 
        nose, mouth, likes 
        FROM users_ab ORDER BY likes DESC;";

        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $rowCount = $stmt->rowCount();
        $details = $stmt->fetchAll(); 

        echo json_encode($details);

        //echo $sql;
    }
}
catch (PDOException $e) {
   echo 'Connection failed: ' . $e->getMessage();
   echo $sql;
}
catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
    echo $sql;
}
?>
