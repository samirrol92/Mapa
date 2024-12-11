<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $matricula = $_POST['matricula'];
    
    $datos = [$nombre, $apellido, $matricula];

    $archivo = fopen("datos.csv", "a");
    fputcsv($archivo, $datos);
    fclose($archivo);

    echo json_encode(["mensaje" => "Datos guardados correctamente"]);
} else {
    echo json_encode(["error" => "No se enviaron datos correctamente"]);
}
?>
