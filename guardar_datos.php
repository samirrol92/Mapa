<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $matricula = $_POST['matricula'];

    $archivo = 'datos.csv';
    
    if (($file = fopen($archivo, 'a')) !== false) {
        fputcsv($file, [$nombre, $apellido, $matricula]);
        fclose($file);
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error']);
    }
}
?>
