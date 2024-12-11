// Inicialización del mapa
var map = L.map('mapa').setView([20.5937, -102.5720], 4); // Coordenada por defecto

// Cargar la capa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Contador de visitas con localStorage
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

// Llamar al contador de visitas al abrir la página
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

                    if (marker) {
                        map.removeLayer(marker);
                    }

                    marker = L.marker([lat, lon]).addTo(map)
                        .bindPopup(`Búsqueda: ${data[0].display_name}`)
                        .openPopup();

                    map.setView([lat, lon], 12);
                } else {
                    alert("No se encontró la ubicación.");
                }
            })
            .catch(error => console.log(error));
    } else {
        alert("Por favor ingresa una dirección.");
    }
}

// Funcionalidad del formulario
document.getElementById('formulario').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(this);

    fetch('formulario.php', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.text())
        .then(data => {
            alert(data); // Muestra un mensaje de confirmación
            mostrarDatos();
            document.getElementById('formulario').reset();
        })
        .catch(error => console.error('Error:', error));
});

// Mostrar datos en la tabla
function mostrarDatos() {
    fetch('datos.csv')
        .then(response => response.text())
        .then(data => {
            const registros = data.split('\n').filter(line => line.trim() !== '');
            const tablaCuerpo = document.getElementById('tabla-cuerpo');
            tablaCuerpo.innerHTML = '';

            registros.forEach((registro, index) => {
                const columnas = registro.split(',');
                const fila = `<tr>
                    <td>${index + 1}</td>
                    <td>${columnas[0]}</td>
                    <td>${columnas[1]}</td>
                    <td>${columnas[2]}</td>
                </tr>`;
                tablaCuerpo.innerHTML += fila;
            });
        });
}

// Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', mostrarDatos);
