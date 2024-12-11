<?php
header('Content-Type: application/json');
$archivo = 'datos.csv';
$datos = [];

if (file_exists($archivo)) {
    if (($file = fopen($archivo, 'r')) !== false) {
        while (($row = fgetcsv($file)) !== false) {
            $datos[] = $row;
        }
        fclose($file);
    }
}

echo json_encode($datos);
?>
