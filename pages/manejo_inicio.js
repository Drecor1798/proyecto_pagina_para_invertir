const contenido = document.getElementById("contenido1");
const contenido2 = document.getElementById("contenido2");
const ingreso = document.getElementById("ingreso");
const transferencia = document.getElementById("transferencia");
const datos = document.getElementById("datos");

const usuario = JSON.parse(localStorage.getItem("usuario_logueado"));

if (!usuario) {
    alert("Debes iniciar sesión.");
    location.href = "/index.html";
} else {
    contenido.innerHTML = `<h1>Bienvenido, ${usuario.nombre} ${usuario.apellido}</h1><br>
    <figcaption class="blockquote-footer">
        Dinero:
    </figcaption>
    <figure>
    <blockquote class="blockquote">
        <h1 class="display-2">${usuario.ingrso_inicial}.${usuario.ingreso_centavos} $</h1>
    </blockquote>
</figure>
    `;
}

ingreso.onclick = () => {
    contenido2.innerHTML = `
        <label for="numero">Nuevo Ingreso:</label>
        <input type="number" id="numero_nuevo" name="numero" min="0" max="100" step="1">
        <input type="number" id="centavo_nuevo" name="centavo" min="0" max="99" step="1">
        <button type="button" class="btn btn-dark" id="nuevo_ingreso">Ingresar</button>
    `;

    document.getElementById("nuevo_ingreso").onclick = () => {
        const numero_nuevo = parseInt(document.getElementById("numero_nuevo").value) || 0;
        const centavo_nuevo = parseInt(document.getElementById("centavo_nuevo").value) || 0;

        // Verificamos que los centavos no sean mayores de 99
        if (centavo_nuevo >= 100) {
            alert("No puedes ingresar más de 99 centavos.");
            return;
        }

        let numeroActual = parseInt(usuario.ingrso_inicial) || 0;
        let centavoActual = parseInt(usuario.ingreso_centavos) || 0;

        let suma_numero = numeroActual + numero_nuevo;
        let suma_centavo = centavoActual + centavo_nuevo;

        if (suma_centavo >= 100) {
            suma_numero += 1;
            suma_centavo -= 100;
        }

        usuario.ingrso_inicial = suma_numero;
        usuario.ingreso_centavos = suma_centavo;

        localStorage.setItem("usuario_logueado", JSON.stringify(usuario));

        actualizarVista(); // Actualiza lo que ve el usuario
    };
};

function actualizarVista() {
    contenido.innerHTML = `
        <h1>Bienvenido, ${usuario.nombre} ${usuario.apellido}</h1><br>
        <figcaption class="blockquote-footer">Dinero:</figcaption>
        <figure>
            <blockquote class="blockquote">
                <h1 class="display-2">${usuario.ingrso_inicial}.${usuario.ingreso_centavos.toString().padStart(2, '0')} $</h1>
            </blockquote>
        </figure>
    `;
}