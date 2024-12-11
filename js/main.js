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
// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const storage = firebase.storage();

// Funcionalidad para contar las visitas
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
      });
  } else {
    alert("Por favor ingresa una dirección.");
  }
}

// Funcionalidad para obtener clima
async function obtenerClima(lat, lon, ciudad) {
  const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const datos = await response.json();
    
    if (datos && datos.main && datos.weather && datos.weather.length > 0) {
      document.getElementById('ciudad').innerText = ciudad;
      document.getElementById('temperatura').innerText = `${datos.main.temp} °C`;
      document.getElementById('descripcion').innerText = datos.weather[0].description;
    } else {
      alert("No se pudieron obtener datos del clima.");
    }
  } catch (error) {
    console.error("Error al obtener la información del clima: ", error);
  }
}

// Funcionalidad para guardar inscripciones en Firebase
document.getElementById('formulario').addEventListener('submit', async function(event) {
  event.preventDefault();
  const datosFormulario = {
    nombre: document.getElementById('nombre').value,
    apellido: document.getElementById('apellido').value,
    matricula: document.getElementById('matricula').value,
  };
  
  try {
    const ref = database.ref('registros');
    await ref.push(datosFormulario);
    cargarDatosEnTabla();
    this.reset();
  } catch (error) {
    console.error('Error al guardar datos: ', error);
  }
});

// Funcionalidad para cargar inscripciones desde Firebase
function cargarDatosEnTabla() {
  const tablaCuerpo = document.getElementById('tabla-cuerpo');
  tablaCuerpo.innerHTML = '';
  
  database.ref('registros').once('value')
    .then(snapshot => {
      const datos = snapshot.val();
      for (let key in datos) {
        const registro = datos[key];
        const fila = `<tr><td>${registro.nombre}</td><td>${registro.apellido}</td><td>${registro.matricula}</td></tr>`;
        tablaCuerpo.innerHTML += fila;
      }
    })
    .catch(error => console.error('Error al obtener datos: ', error));
}
document.addEventListener('DOMContentLoaded', cargarDatosEnTabla);

// Funcionalidad para subir archivos a Firebase Storage
function subirArchivo() {
  const archivo = document.getElementById('archivoSubir').files[0];
  if (archivo) {
    const storageRef = storage.ref();
    const archivoRef = storageRef.child(archivo.name);

    archivoRef.put(archivo)
      .then(() => {
        alert('Archivo subido con éxito');
        mostrarArchivos();
      })
      .catch(error => alert('Error al subir archivo: ' + error.message));
  } else {
    alert('Por favor selecciona un archivo para subir.');
  }
}

// Mostrar archivos subidos desde Firebase Storage
function mostrarArchivos() {
  const divArchivos = document.getElementById('archivos-subidos');
  divArchivos.innerHTML = '';

  storage.ref().listAll()
    .then(result => {
      result.items.forEach(fileRef => {
        fileRef.getDownloadURL()
          .then(url => {
            divArchivos.innerHTML += `<p><a href="${url}" target="_blank">${fileRef.name}</a></p>`;
          });
      });
    })
    .catch(error => alert('Error al cargar archivos: ' + error.message));
}
document.addEventListener('DOMContentLoaded', mostrarArchivos);
