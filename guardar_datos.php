<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = trim($_POST['nombre']);
    $apellido = trim($_POST['apellido']);
    $matricula = trim($_POST['matricula']);

    if ($nombre && $apellido && $matricula) {
        try {
            $archivo = fopen("datos.csv", "a");
            fputcsv($archivo, [$nombre, $apellido, $matricula]);
            fclose($archivo);

            echo json_encode(["mensaje" => "Datos guardados correctamente"]);
        } catch (Exception $e) {
            echo json_encode(["error" => "Error al guardar datos"]);
        }
    } else {
        echo json_encode(["error" => "Campos vacíos no permitidos"]);
    }
} else {
    echo json_encode(["error" => "Método inválido"]);
}
?>
