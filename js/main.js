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

// Configurar Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDDb5-7WA7SUpDfzBkRLQEKtmauyVuG-Lo",
    authDomain: "sample-firebase-ai-app-babee.firebaseapp.com",
    databaseURL: "https://sample-firebase-ai-app-babee-default-rtdb.firebaseio.com/",
    projectId: "sample-firebase-ai-app-babee",
    storageBucket: "sample-firebase-ai-app-babee.firebasestorage.app",
    messagingSenderId: "671153028643",
    appId: "1:671153028643:web:c7a3daa8ecd6ac8e9f7b96",
};

// Iniciar Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Enviar formulario con Firebase
document.getElementById('formulario').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const matricula = document.getElementById('matricula').value.trim();

    if (nombre && apellido && matricula) {
        try {
            const nuevoRegistroRef = database.ref("inscritos").push();
            await nuevoRegistroRef.set({
                nombre,
                apellido,
                matricula,
            });
            alert("Formulario enviado correctamente.");
            this.reset();
        } catch (error) {
            console.error("Error al enviar datos a Firebase: ", error);
            alert("Error al enviar datos a Firebase.");
        }
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
        } else {
            alert("No hay datos para mostrar.");
        }
    });
}

// Cargar la tabla en la vista al iniciar la página
document.addEventListener('DOMContentLoaded', cargarDatosEnTabla);
