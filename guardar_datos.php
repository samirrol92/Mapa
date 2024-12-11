<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $matricula = $_POST['matricula'];

    $datos = [$nombre, $apellido, $matricula];
    
    try {
        $archivo = fopen("datos.csv", "a");
        fputcsv($archivo, $datos);
        fclose($archivo);

        echo json_encode(["mensaje" => "Datos guardados correctamente"]);
    } catch (Exception $e) {
        echo json_encode(["error" => "Error al guardar datos"]);
    }
} else {
    echo json_encode(["error" => "Método inválido"]);
}
?>
