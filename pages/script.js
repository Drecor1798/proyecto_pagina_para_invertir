class Usuarios {
    static id = 0
    constructor(nombre, apellido, ingreso_inicial, email, contrasena){
        this.id = ++Usuarios.id,
        this.nombre = nombre,
        this.apellido = apellido,
        this.ingreso_inicial = ingreso_inicial,
        this.email =  email,
        this.contrasena = contrasena
    }
}

let usuarios = [];
const datosGuardados = localStorage.getItem("usuarios");
if (datosGuardados) {
    const datos = JSON.parse(datosGuardados);
    usuarios = datos.map(
        u => new Usuarios(u.nombre, u.apellido, u.ingreso_inicial, u.email, u.contrasena)
    );
    Usuarios.id = usuarios.length; 
}


const nuevo_usuario = document.getElementById("nuevo_usuario");


let enviar = document.getElementById("enviar");

enviar.onclick = () => {
    let encontrado = false;

    const email = document.getElementById("email").value;
    const contrasena = document.getElementById("contrasena").value;

    for (const usuario of usuarios) {
        if (email === usuario.email && contrasena === usuario.contrasena) {
            let enlace = document.querySelector('a');
            enlace.setAttribute('href', './pages/inicio.html');
            encontrado = true;
            break;
        }
    }

    if (!encontrado) {
        alert("Usuario inválido");
    }
}



nuevo_usuario.onclick = () => {
    const contenido = document.getElementById("contenido")
    contenido.innerHTML = `<label for="nuevo_email" class="form-label">Ingrese correo electrónico</label>
        <input type="text" id="nuevo_email">

        <label for="nueva_contrasena" class="form-label">Ingrese Contraseña</label>
        <input type="text" id="nuevo_contrasena">

        <label for="nombre" class="form-label">Ingrese Nombre</label>
        <input type="text" id="nombre">

        <label for="apellido" class="form-label">Ingrese Apellido</label>
        <input type="text" id="apellido">
        
        <button type="button" id="crear">Crear</button>
        <button type="button" id="atras">Atras</button>`

    document.getElementById('crear').onclick = () => {
        const nuevo_email = document.getElementById('nuevo_email').value;
        const nuevo_contrasena = document.getElementById('nuevo_contrasena').value;
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;

        if (!nuevo_email || !nuevo_contrasena || !nombre || !apellido) {
            alert("Por favor completa todos los campos.");
            return;
        }

        const nuevoUsuario = new Usuarios(nombre, apellido, 0, nuevo_email, nuevo_contrasena);
        usuarios.push(nuevoUsuario);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        alert("Usuario creado con éxito");
        
        document.getElementById("atras").click();

    }

    document.getElementById('atras').onclick = () => {
        contenido.innerHTML = `<h2>Por favor ingresa tus datos</h2>
        <form id="form">
            <label for="email" class="form-label">Correo electrónico</label>
            <input type="text" id="email">

            <label for="contrasena" class="form-label">Cotraseña</label>
            <input type="text" id="contrasena">
        
            <button type="button" id="enviar">Enviar</button>
            <button type="button" id="nuevo_usuario">Nuevo usuario</button>
            </form>`

        document.getElementById("nuevo_usuario").onclick = nuevo_usuario.onclick;
        document.getElementById("enviar").onclick = () => {
            const email = document.getElementById("email").value;
            const contrasena = document.getElementById("contrasena").value;

            let encontrado = false;

            for (const usuario of usuarios) {
                if (email === usuario.email && contrasena === usuario.contrasena) {
                    let enlace = document.querySelector('a');
                    enlace.setAttribute('href', './pages/inicio.html');
                    encontrado = true;
                    break;
                }
            }

            if (!encontrado) {
                alert("Usuario inválido");
            }
        }
    }
}












