var map = L.map('mapa').setView([20.5937, -102.5720], 4);

// Cargar la capa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Funcionalidad para el contador de visitas
function actualizarContador() {
    let visitas = localStorage.getItem('contador_visitas');
    if (visitas) {
        visitas = parseInt(visitas) + 1;
    } else {
        visitas = 1;
    }
    localStorage.setItem('contador_visitas', visitas);
    document.getElementById('contador-visitas').innerText = visitas;
}
actualizarContador();

// Funcionalidad persistente para el formulario
document.getElementById('formulario').addEventListener('submit', function(event) {
    event.preventDefault();
    const datosFormulario = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        matricula: document.getElementById('matricula').value,
    };
    let registros = JSON.parse(localStorage.getItem('registros')) || [];
    registros.push(datosFormulario);
    localStorage.setItem('registros', JSON.stringify(registros));
    cargarDatosEnTabla();
    this.reset();
});

// Cargar los datos persistentes en la tabla
function cargarDatosEnTabla() {
    const registros = JSON.parse(localStorage.getItem('registros')) || [];
    const tablaCuerpo = document.getElementById('tabla-cuerpo');
    tablaCuerpo.innerHTML = '';
    registros.forEach((registro, index) => {
        const fila = `<tr><td>${index + 1}</td><td>${registro.nombre}</td><td>${registro.apellido}</td><td>${registro.matricula}</td></tr>`;
        tablaCuerpo.innerHTML += fila;
    });
}
document.addEventListener('DOMContentLoaded', cargarDatosEnTabla);

// Funcionalidad de subir archivos
function subirArchivo() {
    const archivo = document.getElementById('archivoSubir').files[0];
    if (archivo) {
        const divArchivos = document.getElementById('archivos-subidos');
        const url = URL.createObjectURL(archivo);
        
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.innerText = `Abrir Archivo: ${archivo.name}`;
        enlace.target = "_blank";
        
        divArchivos.innerHTML = ''; // Limpiar la vista anterior
        divArchivos.appendChild(enlace);
    } else {
        alert("Por favor selecciona un archivo.");
    }
}
