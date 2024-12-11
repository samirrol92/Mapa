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
const storage = firebase.storage();
// Funcionalidad para el formulario con Firebase
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
        alert('Datos enviados correctamente');
        this.reset();
        cargarDatosEnTabla();
    } catch (error) {
        console.error('Error al enviar los datos:', error);
        alert('Hubo un problema al enviar los datos');
    }
});

// Función para cargar los datos desde Firebase
function cargarDatosEnTabla() {
    const tablaCuerpo = document.getElementById('tabla-cuerpo');
    tablaCuerpo.innerHTML = '';

    firebase.database().ref('registros').once('value')
        .then(snapshot => {
            const datos = snapshot.val();
            if (datos) {
                for (let key in datos) {
                    const registro = datos[key];
                    const fila = `<tr><td>${registro.nombre}</td><td>${registro.apellido}</td><td>${registro.matricula}</td></tr>`;
                    tablaCuerpo.innerHTML += fila;
                }
            }
        })
        .catch(error => console.error('Error al obtener datos: ', error));
}

// Llamada al cargar la página para mostrar los datos
document.addEventListener('DOMContentLoaded', cargarDatosEnTabla);
