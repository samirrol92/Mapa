<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Recibir los datos enviados por el formulario
    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $matricula = $_POST['matricula'];

    // Ruta del archivo donde se guardarán los datos
    $archivo = 'datos.csv';

    // Crear o abrir el archivo y agregar los datos
    $file = fopen($archivo, 'a');
    fputcsv($file, [$nombre, $apellido, $matricula]);
    fclose($file);

    echo json_encode(['status' => 'Éxito', 'mensaje' => 'Datos guardados correctamente']);
    exit;
}

// Respuesta con todos los datos de los registros
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $archivo = 'datos.csv';
    $datos = [];
    if (file_exists($archivo)) {
        $file = fopen($archivo, 'r');
        while (($linea = fgetcsv($file)) !== false) {
            $datos[] = ['nombre' => $linea[0], 'apellido' => $linea[1], 'matricula' => $linea[2]];
        }
        fclose($file);
    }

    echo json_encode($datos);
    exit;
}
?>
