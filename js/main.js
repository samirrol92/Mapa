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

                    // Llamar a la función para obtener el clima
                    obtenerClima(lat, lon, data[0].display_name);
                } else {
                    alert("No se encontró la ubicación.");
                }
            })
            .catch(error => console.log(error));
    } else {
        alert("Por favor ingresa una dirección.");
    }
}

// Función para obtener el clima
async function obtenerClima(lat, lon, ciudad) {
    const API_KEY = '4ab5902d04be11c4453833d67afc5250'; // Tu clave API aquí
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const datos = await response.json();
        
        if (datos && datos.main && datos.weather) {
            const temperatura = `${datos.main.temp} °C`;
            const descripcion = datos.weather[0].description;

            document.getElementById('ciudad').innerText = ciudad;
            document.getElementById('temperatura').innerText = temperatura;
            document.getElementById('descripcion').innerText = descripcion;
        } else {
            alert('No se pudo obtener la información del clima.');
        }
    } catch (error) {
        console.error('Error al obtener el clima:', error);
        alert('Error al obtener el clima: ' + error.message);
    }
}
