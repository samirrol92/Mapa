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

// Funcionalidad para buscar una ubicación
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
            })
            .catch(error => console.error("Error en la búsqueda de ubicación: ", error));
    } else {
        alert("Por favor ingresa una dirección.");
    }
}

// Funcionalidad para obtener clima
async function obtenerClima(lat, lon, ciudad) {
    const API_KEY = '4ab5902d04be11c4453833d67afc5250';
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        
        if (!response.ok) {
            throw new Error("Error en la solicitud al servidor de clima.");
        }

        const datos = await response.json();

        if (datos && datos.main && datos.weather) {
            document.getElementById('ciudad').innerText = ciudad;
            document.getElementById('temperatura').innerText = `${datos.main.temp} °C`;
            document.getElementById('descripcion').innerText = datos.weather[0].description;
        } else {
            alert("No se pudo obtener información del clima.");
        }
    } catch (error) {
        console.error("Error al obtener el clima: ", error);
        alert("Error al obtener la información del clima.");
    }
}

}

