// Configuración inicial del mapa
var map = L.map('mapa').setView([20.5937, -102.5720], 4); // Coordenada por defecto

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Contador de visitas con localStorage
function actualizarContador() {
    let visitas = localStorage.getItem('contador_visitas');
    visitas = visitas ? parseInt(visitas) + 1 : 1;
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
                } else alert("No se encontró la ubicación.");
            })
            .catch(error => console.error(error));
    } else alert("Por favor ingresa una dirección.");
}

// Función para obtener el clima
async function obtenerClima(lat, lon, ciudad) {
    const API_KEY = '4ab5902d04be11c4453833d67afc5250'; // Reemplazar con tu API KEY
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const datos = await response.json();

        document.getElementById('ciudad').innerText = ciudad;
        document.getElementById('temperatura').innerText = `${datos.main.temp} °C`;
        document.getElementById('descripcion').innerText = datos.weather[0].description;
    } catch (error) {
        console.error('Error al obtener el clima:', error);
        alert('Error al obtener el clima');
    }
}

// Formulario de registro
document.getElementById('formulario').addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const matricula = document.getElementById('matricula').value;

    const datos = { nombre, apellido, matricula };
    let registros = JSON.parse(localStorage.getItem('registros')) || [];
    registros.push(datos);
    localStorage.setItem('registros', JSON.stringify(registros));

    mostrarDatos();
    this.reset();
});

function mostrarDatos() {
    const registros = JSON.parse(localStorage.getItem('registros')) || [];
    const tablaCuerpo = document.getElementById('tabla-cuerpo');
    tablaCuerpo.innerHTML = '';

    registros.forEach((registro, index) => {
        const fila = `<tr>
            <td>${index + 1}</td>
            <td>${registro.nombre}</td>
            <td>${registro.apellido}</td>
            <td>${registro.matricula}</td>
        </tr>`;
        tablaCuerpo.innerHTML += fila;
    });
}
document.addEventListener('DOMContentLoaded', mostrarDatos);

// Subir Archivos
document.getElementById('form-subida').addEventListener('submit', function (event) {
    event.preventDefault();

    const archivo = document.getElementById('archivo').files[0];
    if (archivo) {
        const listaArchivos = document.getElementById('lista-archivos');
        const li = document.createElement('li');
        li.textContent = archivo.name;
        listaArchivos.appendChild(li);
    }
});
