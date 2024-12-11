var map = L.map('mapa').setView([20.5937, -102.5720], 4);

// Cargar la capa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Funcionalidad de contador de visitas
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

// Función para buscar una ubicación
var marker;
function buscarUbicacion() {
    var query = document.getElementById('search').value;
    if (query) {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const lat = parseFloat(data[0].lat);
                    const lon = parseFloat(data[0].lon);

                    if (marker) map.removeLayer(marker);
                    marker = L.marker([lat, lon]).addTo(map)
                        .bindPopup(`Búsqueda: ${data[0].display_name}`)
                        .openPopup();
                    map.setView([lat, lon], 12);
                } else {
                    alert("No se encontró la ubicación.");
                }
            });
    } else {
        alert("Por favor ingresa una dirección.");
    }
}

// Funcionalidad persistente para el formulario con localStorage
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

// Mostrar los datos guardados en la tabla
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

// Funcionalidad para subir archivos y crear enlace de descarga
function subirArchivo() {
    const archivo = document.getElementById('archivoSubir').files[0];
    if (archivo) {
        const divArchivos = document.getElementById('archivos-subidos');
        
        const enlace = document.createElement('a');
        const url = URL.createObjectURL(archivo);

        enlace.href = url;
        enlace.download = archivo.name;
        enlace.innerText = `Descargar: ${archivo.name}`;
        enlace.target = "_blank";

        divArchivos.appendChild(enlace);
        divArchivos.appendChild(document.createElement('br'));
    } else {
        alert("Por favor, selecciona un archivo para subir.");
    }
}
