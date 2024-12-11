// Mapa
var map = L.map('mapa').setView([20.5937, -102.5720], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Clima
function obtenerClima(lat, lon) {
    const apiKey = '4ab5902d04be11c4453833d67afc5250';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                document.getElementById('ciudad').innerText = data.name || "N/A";
                document.getElementById('temperatura').innerText = `${data.main.temp} °C`;
                document.getElementById('descripcion').innerText = data.weather[0].description || "N/A";
            } else {
                alert("Error al obtener el clima.");
            }
        })
        .catch(error => {
            console.error("Error al obtener el clima:", error);
        });
}
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
                    obtenerClima(lat, lon);
                } else {
                    alert("No se encontró la ubicación.");
                }
            });
    } else {
        alert("Por favor ingresa una dirección.");
    }
}

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

// Persistencia de formulario
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

// Mostrar datos en la tabla
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

// Subir archivo
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
