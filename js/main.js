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

// Configurar Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC7bkr1ODDhuAdDiTIAAnMiOPqCWFSqbSU",
    authDomain: "mapa-257cd.firebaseapp.com",
    databaseURL: "https://mapa-257cd-default-rtdb.firebaseio.com",
    projectId: "mapa-257cd",
    storageBucket: "mapa-257cd.firebasestorage.app",
    messagingSenderId: "381347272248",
    appId: "1:381347272248:web:c43e1b4e947bdd3c9cb8cd",
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Enviar formulario con Firebase
document.getElementById('formulario').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const matricula = document.getElementById('matricula').value.trim();

    if (nombre && apellido && matricula) {
        const nuevoRegistroRef = database.ref("inscritos").push();
        nuevoRegistroRef.set({
            nombre,
            apellido,
            matricula,
        })
        .then(() => {
            alert("Formulario enviado correctamente.");
            this.reset();
        })
        .catch((error) => {
            alert("Error al enviar datos a Firebase: " + error.message);
        });
    } else {
        alert("Por favor, complete todos los campos.");
    }
});

// Función para cargar los datos desde Firebase en la tabla
function cargarDatosEnTabla() {
    const tablaCuerpo = document.getElementById('tabla-cuerpo');
    tablaCuerpo.innerHTML = ""; // Limpiar la tabla antes de recargar

    database.ref('inscritos').on('value', (snapshot) => {
        const inscritos = snapshot.val();
        if (inscritos) {
            let index = 1;
            for (let id in inscritos) {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${index++}</td>
                    <td>${inscritos[id].nombre}</td>
                    <td>${inscritos[id].apellido}</td>
                    <td>${inscritos[id].matricula}</td>
                `;
                tablaCuerpo.appendChild(fila);
            }
        }
    });
}

// Cargar la tabla en la vista al iniciar la página
document.addEventListener('DOMContentLoaded', cargarDatosEnTabla);
