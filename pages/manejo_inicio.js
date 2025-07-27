const contenido = document.getElementById("contenido1");
const contenido2 = document.getElementById("contenido2");
const ingreso = document.getElementById("ingreso");
const transferencia = document.getElementById("transferencia");
const datos = document.getElementById("datos");
const home = document.getElementById("home");
const historial = document.getElementById("historial"); 
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

function mostrarMensaje(texto) {
    const log = document.getElementById("mensaje-log");

    const claveMensajes = `mensajes_log_${usuario.email}`;

    let mensajes = JSON.parse(localStorage.getItem(claveMensajes)) || [];

    const fecha = new Date().toLocaleTimeString();
    const mensajeCompleto = `[${fecha}] ${texto}`;
    mensajes.push(mensajeCompleto);

    localStorage.setItem(claveMensajes, JSON.stringify(mensajes));

    if (log) {
        log.innerHTML = mensajes.map(msg => `<div class="mensaje">${msg}</div>`).join("");
        log.scrollTop = log.scrollHeight;
    }
}

home.onclick = () => {
    location.reload(); 
}

ingreso.onclick = () => {
    contenido2.innerHTML = `
    <div class="nuevo-ingreso-container">
        <h2>Nuevo Ingreso</h2>
        <label for="numero_nuevo" class="label-monto">Monto:</label>
        <div class="input-monto">
            <input type="number" id="numero_nuevo" name="numero" min="0" max="100" step="1" placeholder="0">
            <span class="punto">.</span>
            <input type="number" id="centavo_nuevo" name="centavo" min="0" max="99" step="1" placeholder="00">
            <span class="signo">$</span>
        </div>
        <div class="botones">
            <button type="button" class="btn btn-dark" id="nuevo_ingreso">Ingresar</button>
            <button type="button" class="btn btn-dark" id="atras">Atrás</button>
        </div>
    </div>
    `;

    document.getElementById("nuevo_ingreso").onclick = () => {
        const numero_nuevo = parseInt(document.getElementById("numero_nuevo").value) || 0;
        const centavo_nuevo = parseInt(document.getElementById("centavo_nuevo").value) || 0;

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

        localStorage.setItem('usuario_logueado', JSON.stringify(usuario));

        actualizarVista();
        mostrarMensaje(`Ingresaste $${numero_nuevo}.${centavo_nuevo.toString().padStart(2, "0")}`);

    };

    document.getElementById("atras").onclick = () => {
        location.reload(); 
    };
    
};

transferencia.onclick = () => {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const destinatarios = usuarios.filter(u => u.email !== usuario.email);

    if (destinatarios.length === 0) {
        alert("No hay otros usuarios a quienes transferir.");
        return;
    }


    const opciones = destinatarios.map(u => `<option value="${u.email}">${u.nombre} ${u.apellido}</option>`).join('');

    contenido2.innerHTML = `
        <h3>Transferencia</h3>
        <label>Monto a transferir:</label>

        <div class="input-monto">
            <input type="number" id="cantidad_transferida" name="numero" min="0" max="100" step="1" placeholder="0">
            <span class="punto">.</span>
            <input type="number" id="centavo_transferido" name="centavo" min="0" max="99" step="1" placeholder="00">
            <span class="signo">$</span>
        </div>

        <label>Seleccionar destinatario:</label>
        <select id="persona_transferida">${opciones}</select><br><br>

        <button class="btn btn-dark" id="nueva_transferencia">Transferir</button>
        <button class="btn btn-secondary" id="atras">Atrás</button>
    `;

    document.getElementById("nueva_transferencia").onclick = () => {
        const monto = parseInt(document.getElementById("cantidad_transferida").value) || 0;
        const centavos = parseInt(document.getElementById("centavo_transferido").value) || 0;
        const email_destino = document.getElementById("persona_transferida").value;

        if (centavos >= 100 || monto < 0 || centavos < 0) {
            alert("Monto inválido.");
            return;
        }

        let totalOrigenPesos = parseInt(usuario.ingrso_inicial);
        let totalOrigenCentavos = parseInt(usuario.ingreso_centavos);

        let totalOrigen = totalOrigenPesos * 100 + totalOrigenCentavos;
        let totalTransferencia = monto * 100 + centavos;

        if (totalTransferencia > totalOrigen) {
            alert("Fondos insuficientes.");
            return;
        }

        totalOrigen -= totalTransferencia;
        usuario.ingrso_inicial = Math.floor(totalOrigen / 100);
        usuario.ingreso_centavos = totalOrigen % 100;

        const receptor = usuarios.find(u => u.email === email_destino);
        let totalReceptor = (parseInt(receptor.ingrso_inicial) || 0) * 100 + (parseInt(receptor.ingreso_centavos) || 0);
        totalReceptor += totalTransferencia;
        receptor.ingrso_inicial = Math.floor(totalReceptor / 100);
        receptor.ingreso_centavos = totalReceptor % 100;

        const nuevosUsuarios = usuarios.map(u => {
            if (u.email === usuario.email) return usuario;
            if (u.email === receptor.email) return receptor;
            return u;
        });

        localStorage.setItem("usuarios", JSON.stringify(nuevosUsuarios));
        localStorage.setItem("usuario_logueado", JSON.stringify(usuario));

        alert("Transferencia realizada con éxito.");
        actualizarVista();
        mostrarMensaje(`Transferiste $${monto}.${centavos.toString().padStart(2, '0')} a ${receptor.nombre} ${receptor.apellido}`);

    };

    document.getElementById("atras").onclick = () => {
        location.reload();
    };
};

datos.onclick = () => {
    contenido2.innerHTML = `
        <h3>Editar datos</h3>
        <label>Nombre actual: ${usuario.nombre}</label><br>
        <input type="text" id="ne" placeholder="Nuevo nombre"><br><br>
        <label>Nombre actual: ${usuario.apellido}</label><br>
        <input type="text" id="ap" placeholder="Nuevo apellido"><br><br>
        <button class="btn btn-dark" id="editar_nombre">Guardar cambios</button>
        <button class="btn btn-secondary" id="atras">Atrás</button>
    `;

    document.getElementById("editar_nombre").onclick = () => {
        const nuevoNombre = document.getElementById("ne").value.trim();
        const nuevoApellido = document.getElementById("ap").value.trim();

        if (nuevoNombre === "" || nuevoApellido === "") {
            alert("El nombre o apellido no puede estar vacío.");
            return;
        }

        usuario.nombre = nuevoNombre;

        usuario.apellido = nuevoApellido;

        localStorage.setItem("usuario_logueado", JSON.stringify(usuario));

        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const nuevosUsuarios = usuarios.map(u => {
            if (u.email === usuario.email) return usuario;
            return u;
        });
        localStorage.setItem("usuarios", JSON.stringify(nuevosUsuarios));

        alert("Nombre actualizado con éxito.");
        actualizarVista();
    };

    document.getElementById("atras").onclick = () => {
        location.reload();
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




historial.onclick = () => {
    contenido2.innerHTML = `<div id="mensaje-log" class="mensaje-log"></div>`;

    function cargarMensajesGuardados() {
        const log = document.getElementById("mensaje-log");
        const claveMensajes = `mensajes_log_${usuario.email}`;
        const mensajes = JSON.parse(localStorage.getItem(claveMensajes)) || [];
        
        log.innerHTML = mensajes.map(msg => `<div class="mensaje">${msg}</div>`).join("");
    }

    cargarMensajesGuardados();
};



