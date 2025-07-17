class Usuario {
    static id = 0;
    constructor(nombre, apellido, email, contrasena) {
        this.id = ++Usuario.id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.contrasena = contrasena;
        this.ingrso_inicial = 0;
        this.ingreso_centavos = 0;
    }
}

let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
Usuario.id = usuarios.length;

const contenido = document.getElementById("contenido");

document.getElementById("enviar").onclick = () => {
    const email = document.getElementById("email").value;
    const contrasena = document.getElementById("contrasena").value;

    const usuario = usuarios.find(u => u.email === email && u.contrasena === contrasena);
    if (usuario) {
        localStorage.setItem("usuario_logueado", JSON.stringify(usuario));
        location.href = '/pages/inicio.html';
    } else {
        alert("Usuario o contraseña incorrectos");
    }
};

localStorage.setItem("usuario_logueado", JSON.stringify(usuario_logueado));

document.getElementById("nuevo_usuario").onclick = () => {
    contenido.innerHTML = `
        <h2>Registro</h2>
    <div class="mb-3">
        <label for="nombre" class="form-label">Nombre:</label>
        <input type="text" class="form-control" id="nombre">
    </div>
    <div class="mb-3">
        <label for="apellido" class="form-label">Apellido:</label>
        <input type="text" class="form-control" id="apellido">
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
        const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellido").value;
        const email = document.getElementById("nuevo_email").value;
        const contrasena = document.getElementById("nuevo_contrasena").value;

        if (usuarios.find(u => u.email === email)) {
            alert("El correo ya está registrado.");
            return;
        }

        const nuevoUsuario = new Usuario(nombre, apellido, email, contrasena);
        usuarios.push(nuevoUsuario);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        alert("Usuario creado con éxito");
        location.reload(); 
    };

    document.getElementById("atras").onclick = () => {
        location.reload(); 
    };
};













