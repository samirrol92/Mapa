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
                    obtenerClima(lat, lon, data[0].display_name);
                } else {
                    alert("No se encontró la ubicación.");
                }
            });
    } else {
        alert("Por favor ingresa una dirección.");
    }
}

// Funcionalidad para clima
async function obtenerClima(lat, lon, ciudad) {
    const API_KEY = '4ab5902d04be11c4453833d67afc5250';
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const datos = await response.json();
    document.getElementById('ciudad').innerText = ciudad;
    document.getElementById('temperatura').innerText = `${datos.main.temp} °C`;
    document.getElementById('descripcion').innerText = datos.weather[0].description;
}

// Funcionalidad persistente para el formulario con localStorage
document.getElementById('formulario').addEventListener('submit', async function(event) {
    event.preventDefault();

    const datosFormulario = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        matricula: document.getElementById('matricula').value,
    };

    try {
        const response = await fetch('guardar_inscripcion.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosFormulario),
        });

        if (response.ok) {
            cargarDatosEnTabla();
            document.getElementById('formulario').reset();
        } else {
            alert("Hubo un problema al enviar los datos.");
        }
    } catch (error) {
        console.error('Error al enviar datos:', error);
    }
});

// Función para cargar la tabla de manera global
async function cargarDatosEnTabla() {
    try {
        const response = await fetch('guardar_inscripcion.php', { method: 'GET' });
        const registros = await response.json();
        const tablaCuerpo = document.getElementById('tabla-cuerpo');
        tablaCuerpo.innerHTML = '';

        registros.forEach((registro, index) => {
            const fila = `<tr><td>${index + 1}</td><td>${registro.nombre}</td><td>${registro.apellido}</td><td>${registro.matricula}</td></tr>`;
            tablaCuerpo.innerHTML += fila;
        });
    } catch (error) {
        console.error('Error al cargar la tabla:', error);
    }
}

// Cargar la tabla global al cargar la página
document.addEventListener('DOMContentLoaded', cargarDatosEnTabla);

// Funcionalidad para manejar subida de archivos persistente
function subirArchivo() {
    const archivo = document.getElementById('archivoSubir').files[0];
    if (archivo) {
        let archivosGuardados = JSON.parse(localStorage.getItem('archivos_subidos')) || [];
        archivosGuardados.push(archivo.name);
        localStorage.setItem('archivos_subidos', JSON.stringify(archivosGuardados));
        cargarArchivosEnVista();
        document.getElementById('archivoSubir').value = '';
    } else {
        alert("Por favor selecciona un archivo para subir.");
    }
}

function cargarArchivosEnVista() {
    const divArchivos = document.getElementById('archivos-subidos');
    divArchivos.innerHTML = '';
    const archivosGuardados = JSON.parse(localStorage.getItem('archivos_subidos')) || [];
    archivosGuardados.forEach(archivo => {
        divArchivos.innerHTML += `<p>Archivo Subido: ${archivo}</p>`;
    });
}

document.addEventListener('DOMContentLoaded', cargarArchivosEnVista);
