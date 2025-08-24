function generarNumeroAleatorioDe8Digitos() {
    const min = 10000000; 
    const max = 99999999; 
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Usuario {
    static id = 0;
    constructor(nombre, email, contrasena) {
        this.id = ++Usuario.id;
        this.nombre = nombre;
        this.email = email;
        this.contrasena = contrasena;
        this.ingrso_inicial = 0;
        this.ingreso_centavos = 0;
        this.ingrso_inicial_dolar = 0;
        this.ingreso_centavos_dolar = 0;
        this.CBU = generarNumeroAleatorioDe8Digitos(); 
    }
}


let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
Usuario.id = usuarios.length;

const contenido = document.getElementById("contenido");
const usuario_creado = document.getElementById("usuario_creado");

document.getElementById("enviar").onclick = () => {
    const email = document.getElementById("email").value;
    const contrasena = document.getElementById("contrasena").value;

    const usuario = usuarios.find(u => u.email === email && u.contrasena === contrasena);
    if (usuario) {
        localStorage.setItem("usuario_logueado", JSON.stringify(usuario));
        location.href = '/pages/inicio.html';
    } else {
        Swal.fire({
            icon: "error",
            title: "Datos incorrectos",
            text: "El correo o la contraseña no coinciden.",
        });
    }
};

document.getElementById("nuevo_usuario").onclick = () => {
    contenido.innerHTML = `
        <h2>Registro</h2>
        <div class="mb-3">
            <label for="nombre" class="form-label">Nombre y Apellido:</label>
            <input type="text" class="form-control" id="nombre">
        </div>
        <div class="mb-3">
            <label for="nuevo_email" class="form-label">Correo electrónico</label>
            <input type="email" class="form-control" id="nuevo_email" placeholder="nombre@ejemplo.com">
        </div>
        <div class="mb-3">
            <label for="nuevo_contrasena" class="form-label">Contraseña</label>
            <input type="password" class="form-control" id="nuevo_contrasena" placeholder="Contraseña">
        </div>
        <button type="button" class="btn btn-dark" id="crear">Crear</button>
        <button type="button" class="btn btn-dark" id="atras">Atrás</button>
    `;

    document.getElementById("crear").onclick = () => {
        // const nombre = document.getElementById("nombre").value.trim();
        // const email = document.getElementById("nuevo_email").value.trim();
        // const contrasena = document.getElementById("nuevo_contrasena").value.trim();
        
        // if (!nombre || !email || !contrasena) {
        //     Swal.fire({
        //         icon: "warning",
        //         title: "Todos los campos son obligatorios",
        //     });
        //     return;
        // }
        // if (usuarios.find(u => u.email === email)) {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Este email ya está registrado",
        //     });
        //     return;
        // }
        
        // const nuevoUsuario = new Usuario(nombre, email, contrasena);
        // usuarios.push(nuevoUsuario);
        // localStorage.setItem("usuarios", JSON.stringify(usuarios));
        
        Swal.fire({
            icon: "success",
            title: "Usuario creado con éxito",
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            location.reload();
        });
    };
    
    document.getElementById("atras").onclick = () => {
        location.reload(); 
    };
};



const URL = 'https://jsonplaceholder.typicode.com/users'

function generarContrasenaSegura() {
    const mayusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const minusculas = 'abcdefghijklmnopqrstuvwxyz';
    const numeros = '0123456789';
    const simbolos = '!@#$%^&*()_+[]{}|;:,.<>?';

    const obtenerAleatorio = str => str[Math.floor(Math.random() * str.length)];

    let contrasena = '';
    contrasena += obtenerAleatorio(mayusculas);
    contrasena += obtenerAleatorio(minusculas);
    contrasena += obtenerAleatorio(numeros);
    contrasena += obtenerAleatorio(simbolos);

    const todos = mayusculas + minusculas + numeros + simbolos;
    while (contrasena.length < 12) {
        contrasena += obtenerAleatorio(todos);
    }

    contrasena = contrasena.split('').sort(() => Math.random() - 0.5).join('');

    return contrasena;
}


function obtenerUsuarios() {
    fetch(URL)
        .then(response => response.json())
        .then(data => {
            const nuevosUsuarios = data.map(usuario => {
                const nombre_ext = usuario.name;
                const email_ext = usuario.email;
                const contrasena_segura = generarContrasenaSegura(); 

                return new Usuario(nombre_ext, email_ext, contrasena_segura);
            });

            nuevosUsuarios.forEach(nuevoUsuario => {
                if (!usuarios.some(u => u.email === nuevoUsuario.email)) {
                    usuarios.push(nuevoUsuario);
                }
            });

            localStorage.setItem("usuarios", JSON.stringify(usuarios));
        });
}


obtenerUsuarios()

function mostrarUsuarios() {
    if (usuarios.length === 0) return;

    let html = `
        <div class="mt-4">
            <h4>Usuarios registrados</h4>
            <ul class="list-group">
    `;

    usuarios.forEach(u => {
        html += `
            <li class="list-group-item">
                <strong>Nombre:</strong> ${u.nombre} <br>
                <strong>Email:</strong> ${u.email} <br>
                <strong>Contraseña:</strong> ${u.contrasena}
            </li>
        `;
    });

    html += `
            </ul>
        </div>
        <button type="button" class="btn btn-dark" id="atras">Atrás</button>
    `;

    document.getElementById("usuario_creado").innerHTML = html;
    document.getElementById("atras").onclick = () => {
        location.reload(); 
    };
}


document.getElementById("usuario_creado_boton").onclick = () => {
    mostrarUsuarios();
};













