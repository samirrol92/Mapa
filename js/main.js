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

// Funcionalidad para obtener clima
async function obtenerClima(lat, lon, ciudad) {
    const API_KEY = '4ab5902d04be11c4453833d67afc5250';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(url);

        if (!response.ok) throw new Error("Error en la solicitud del clima.");

        const datos = await response.json();
        document.getElementById('ciudad').innerText = ciudad;
        document.getElementById('temperatura').innerText = `${datos.main.temp} °C`;
        document.getElementById('descripcion').innerText = datos.weather[0].description;
    } catch (error) {
        alert('No se pudo obtener la información del clima.');
    }
}

// Enviar formulario con AJAX
document.getElementById('formulario').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("nombre", document.getElementById('nombre').value);
    formData.append("apellido", document.getElementById('apellido').value);
    formData.append("matricula", document.getElementById('matricula').value);

    try {
        const response = await fetch('guardar_datos.php', {
            method: 'POST',
            body: formData
        });

        const resultado = await response.json();
        if (resultado.mensaje) {
            alert(resultado.mensaje);
        } else {
            alert(resultado.error);
        }

        cargarDatosEnTabla();
        this.reset();
    } catch (error) {
        alert('Error al enviar los datos');
    }
});

function cargarDatosEnTabla() {
    fetch('datos.csv')
        .then(response => response.text())
        .then(csv => {
            const filas = csv.trim().split("\n");
            const tablaCuerpo = document.getElementById('tabla-cuerpo');
            tablaCuerpo.innerHTML = ''; // Limpiar la tabla antes de recargar

            filas.forEach((fila, index) => {
                const datos = fila.split(",");
                
                // Validar que la fila tiene exactamente 3 columnas y contiene datos
                if (datos.length === 3 && datos[0] && datos[1] && datos[2]) {
                    tablaCuerpo.innerHTML += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${datos[0]}</td>
                            <td>${datos[1]}</td>
                            <td>${datos[2]}</td>
                        </tr>
                    `;
                }
            });
        })
        .catch(error => console.error('Error al cargar los datos:', error));
}


document.addEventListener('DOMContentLoaded', cargarDatosEnTabla);
