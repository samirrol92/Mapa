<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = trim($_POST['nombre'] ?? '');
    $apellido = trim($_POST['apellido'] ?? '');
    $matricula = trim($_POST['matricula'] ?? '');

    // Validación básica para asegurarse de que los campos no están vacíos
    if ($nombre && $apellido && $matricula) {
        try {
            // Ruta absoluta del archivo
            $archivo_path = __DIR__ . "/datos.csv";

            // Crear el archivo si no existe
            if (!file_exists($archivo_path)) {
                $archivo_creado = fopen($archivo_path, "w");
                if ($archivo_creado) {
                    fclose($archivo_creado);
                } else {
                    throw new Exception("No se pudo crear el archivo.");
                }
            }

            // Abrir el archivo para agregar datos
            $archivo = fopen($archivo_path, "a");

            if (!$archivo) {
                throw new Exception("No se pudo abrir el archivo para escritura.");
            }

            // Guardar datos en formato CSV
            if (fputcsv($archivo, [$nombre, $apellido, $matricula])) {
                fclose($archivo);
                echo json_encode(["mensaje" => "Datos guardados correctamente"]);
            } else {
                fclose($archivo);
                throw new Exception("No se pudo escribir en el archivo.");
            }
        } catch (Exception $e) {
            // Capturar y devolver el error
            echo json_encode(["error" => $e->getMessage()]);
        }
    } else {
        echo json_encode(["error" => "Todos los campos deben estar llenos"]);
    }
} else {
    echo json_encode(["error" => "Método inválido"]);
}
?>

