let contenido = document.getElementById('contenido');
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let emailActivo = localStorage.getItem("usuarioActivo");

function renderUsuario(usuarioItem) {
    const usuario = usuarioItem.find(u => u.email === emailActivo);
    
    if (!usuario) {
        contenido.innerHTML = `<h2>No se encontró un usuario activo.</h2>`;
        return;
    }

    const saludo = document.createElement("div");
    saludo.innerHTML = `<h1>Bienvenido ${usuario.nombre} ${usuario.apellido}</h1>`;
    contenido.appendChild(saludo);
}

renderUsuario(usuarios);

