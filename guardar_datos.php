<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $matricula = $_POST['matricula'];

    // Ruta del archivo donde se guardarán los datos
    $archivo = 'datos.csv';

    // Crear o abrir el archivo y agregar los datos
    $file = fopen($archivo, 'a');
    fputcsv($file, [$nombre, $apellido, $matricula]);
    fclose($file);

    echo "Datos guardados correctamente";
}
?>
