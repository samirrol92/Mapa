// Configurar Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
};
firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const storage = firebase.storage();

// Funcionalidad del contador de visitas
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

// Funcionalidad de búsqueda con mapas y clima
let map = L.map('mapa').setView([20.5937, -102.5720], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

async function obtenerClima(lat, lon, ciudad) {
    const API_KEY = 'YOUR_OPENWEATHERMAP_KEY';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    const res = await fetch(url);
    const datos = await res.json();
    document.getElementById('ciudad').innerText = ciudad;
    document.getElementById('temperatura').innerText = `${datos.main.temp} °C`;
    document.getElementById('descripcion').innerText = datos.weather[0].description;
}

function buscarUbicacion() {
    const query = document.getElementById('search').value;
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
        .then(res => res.json())
        .then(data => {
            const lat = data[0]?.lat;
            const lon = data[0]?.lon;
            if (lat && lon) {
                map.setView([lat, lon], 12);
                obtenerClima(lat, lon, data[0].display_name);
            }
        });
}

document.getElementById('formulario').addEventListener('submit', async function (e) {
    e.preventDefault();
    const datos = {
        nombre: e.target.nombre.value,
        apellido: e.target.apellido.value,
        matricula: e.target.matricula.value,
    };
    await database.ref('registros').push(datos);
    alert('Formulario enviado correctamente');
});

function subirArchivo() {
    const archivo = document.getElementById('archivoSubir').files[0];
    if (!archivo) return alert("Selecciona un archivo.");
    const ref = storage.ref(archivo.name);
    ref.put(archivo).then(() => alert('Archivo subido.'));
}
Vista);
