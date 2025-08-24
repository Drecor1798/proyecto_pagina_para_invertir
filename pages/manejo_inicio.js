document.addEventListener("DOMContentLoaded", () => {
    const contenido = document.getElementById("contenido1");
    const contenido2 = document.getElementById("contenido2");
    const contenido3 = document.getElementById('contenido3');
    const ingreso = document.getElementById("ingreso");
    const transferencia = document.getElementById("transferencia");
    const datos = document.getElementById("datos");
    const home = document.getElementById("home");
    const historial = document.getElementById("historial");
    const comprar_dolar = document.getElementById("comprar_dolar");
    const vender_dolar = document.getElementById("vender_dolar");


    let usuario = JSON.parse(localStorage.getItem("usuario_logueado"));
    if (!usuario) {
        Swal.fire({
            icon: "error",
            title: "Este email ya está registrado",
        });
        location.href = "/index.html";
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    actualizarVista();

    

    function actualizarVista() {
        contenido.innerHTML = `
            <h1>Bienvenido/a, ${usuario.nombre}</h1><br>
            <figcaption class="blockquote-footer">Dinero:</figcaption>
            <figure>
            <blockquote class="blockquote">
                <h1 class="display-2">${usuario.ingrso_inicial}.${usuario.ingreso_centavos.toString().padStart(2, '0')} $</h1>
            </blockquote>
            </figure>
            <div id="dolar">
            <button type="button" class="btn btn-dark" id="ver_dolar">Billetera dólar</button>
            </div>
            `;
            const dolar = document.getElementById("ver_dolar");
            dolar.onclick = () => {
                contenido.innerHTML = `
                <h1>Bienvenido/a, ${usuario.nombre}</h1><br>
                <figcaption class="blockquote-footer">Dinero en dólares:</figcaption>
                <figure>
                <blockquote class="blockquote">
                    <h1 class="display-2">${usuario.ingrso_inicial_dolar || 0}.${(usuario.ingreso_centavos_dolar || 0).toString().padStart(2, '0')} USD</h1>
                </blockquote>
                </figure>
                <div>
                    <button type="button" class="btn btn-dark" id="volver">Billetera en pesos</button>
                    </div>
                `;
                document.getElementById("volver").onclick = () => {
                    actualizarVista();
                };
            };
        }





    function mostrarMensaje(texto) {
        const log = document.getElementById("mensaje-log");
        const clave = `mensajes_log_${usuario.email}`;
        let mensajes = JSON.parse(localStorage.getItem(clave)) || [];

        const ahora = new Date();
        mensajes.push({
            dia: ahora.toLocaleDateString(),
            fecha: ahora.toLocaleTimeString(),
            texto: texto
        });

        localStorage.setItem(clave, JSON.stringify(mensajes));

        if (log) {
            log.innerHTML = mensajes.map(msg => `
                <div class="mensaje">
                    <strong>${msg.fecha} ${msg.dia}</strong>: ${msg.texto}
                </div>`).join("");
        }
    }

    home.onclick = () => location.reload();

    ingreso.onclick = () => {
        contenido2.innerHTML = `
            <h3>Nuevo Ingreso</h3>
            <label>Monto:</label>
            <div class="input-monto">
                <input type="number" id="numero_nuevo" step="1" min="0" placeholder="0">
                <span class="punto">.</span>
                <input type="number" id="centavo_nuevo" min="0" max="99" placeholder="00">
                <span class="signo">$</span>
            </div>
            <div class="botones">
                <button class="btn btn-dark" id="nuevo_ingreso">Ingresar</button>
                <button class="btn btn-dark" id="atras">Atrás</button>
            </div>
        `;

        document.getElementById("nuevo_ingreso").onclick = () => {
            const monto = parseInt(document.getElementById("numero_nuevo").value) || 0;
            const centavos = parseInt(document.getElementById("centavo_nuevo").value) || 0;

            if (centavos >= 100){
                Swal.fire({
                    icon: "error",
                    title: "No pueden ingresar mas de 99 centavos",
                });
                return;
            }

            let total = (usuario.ingrso_inicial * 100 + usuario.ingreso_centavos) + (monto * 100 + centavos);
            usuario.ingrso_inicial = Math.floor(total / 100);
            usuario.ingreso_centavos = total % 100;

            actualizarUsuario();
            mostrarMensaje(`Ingresaste $${monto}.${centavos.toString().padStart(2, '0')}`);
            
            
            Swal.fire({
                icon: "success",
                title: "Ingreso completado",
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                location.reload();
            });


        };

        document.getElementById("atras").onclick = () => location.reload();
    };

    transferencia.onclick = () => {
        const destinatarios = usuarios.filter(u => u.email !== usuario.email);
        if (destinatarios.length === 0){
            Swal.fire({
                    icon: "error",
                    title: "No hay otros usuarios",
                });
                return;
        }

        contenido2.innerHTML = `
            <h3>Transferencia</h3>
            <label>Monto:</label>
            <div class="input-monto">
                <input type="number" id="cantidad_transferida" step="1" min="0" placeholder="0">
                <span class="punto">.</span>
                <input type="number" id="centavo_transferido" min="0" max="99" placeholder="00">
                <span class="signo">$</span>
            </div>
            <label>Nombre completo o CBU del destinatario:</label>
            <input type="text" id="destinatario" placeholder="Ej. Juan Pérez o 12345678">
            <br><br>
            <button class="btn btn-dark" id="nueva_transferencia">Transferir</button>
            <button class="btn btn-secondary" id="atras">Atrás</button>
        `;

        document.getElementById("nueva_transferencia").onclick = () => {
            const monto = parseInt(document.getElementById("cantidad_transferida").value) || 0;
            const centavos = parseInt(document.getElementById("centavo_transferido").value) || 0;
            const inputValor = document.getElementById("destinatario").value.trim().toLowerCase();

            if (!inputValor){
                Swal.fire({
                    icon: "error",
                    title: "Ingrese nombre o CBU",
                });
                return;
            } 
            if (centavos >= 100 || monto < 0 || centavos < 0){
                Swal.fire({
                    icon: "error",
                    title: "No pueden ingresar mas de 99 centavos",
                });
                return;
            } 

            const receptor = destinatarios.find(u => {
                const fullName = `${u.nombre}`.toLowerCase();
                const cbu = u.CBU ? String(u.CBU) : "";
                return fullName.includes(inputValor) || cbu === inputValor;
            });

            if (!receptor){
                Swal.fire({
                    icon: "error",
                    title: "Destinatario no encontrado",
                });
                return;
            }

            const totalTransferencia = monto * 100 + centavos;
            let totalOrigen = usuario.ingrso_inicial * 100 + usuario.ingreso_centavos;
            if (totalTransferencia > totalOrigen){
                Swal.fire({
                    icon: "error",
                    title: "Fondos insuficientes",
                });
                return;
            }

            totalOrigen -= totalTransferencia;
            usuario.ingrso_inicial = Math.floor(totalOrigen / 100);
            usuario.ingreso_centavos = totalOrigen % 100;

            let totalReceptor = (receptor.ingrso_inicial || 0) * 100 + (receptor.ingreso_centavos || 0);
            totalReceptor += totalTransferencia;
            receptor.ingrso_inicial = Math.floor(totalReceptor / 100);
            receptor.ingreso_centavos = totalReceptor % 100;

            actualizarUsuarios(receptor);

            Swal.fire({
                icon: "success",
                title: "Transferencia realizada con exito",
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                location.reload();
            });
            mostrarMensaje(`Transferiste $${monto}.${centavos.toString().padStart(2, '0')} a ${receptor.nombre}`);
            guardarMensajeReceptor(receptor.email, `Recibiste $${monto}.${centavos.toString().padStart(2, '0')} de ${usuario.nombre}`);
            
        };

        document.getElementById("atras").onclick = () => location.reload();
    };

    comprar_dolar.onclick = () => {
        contenido2.innerHTML = `
        <h3>Compra de Dólares</h3>
        <div class="input-monto">
            <input type="number" id="dolar_comprado" step="1" min="1" placeholder="0">
            <span class="signo">USD</span>
        </div><br>
        <button class="btn btn-dark" id="compra">Comprar</button>
        `;
        document.getElementById("compra").onclick = () => {
            const dolaresAComprar = parseInt(document.getElementById("dolar_comprado").value) || 0;
            
            if (dolaresAComprar < 1) {
                Swal.fire({
                    icon: "error",
                    title: "Debes ingresar al menos 1 dólar",
                });
                return;
            }
            const tasaCambio = 1354; 
            const costoEnPesos = dolaresAComprar * tasaCambio;
            let totalPesosCentavos = (usuario.ingrso_inicial || 0) * 100 + (usuario.ingreso_centavos || 0);
            if (costoEnPesos * 100 > totalPesosCentavos) {
                Swal.fire({
                    icon: "error",
                    title: "Fondos insuficientes para esta compra",
                });
                return;
            }
            totalPesosCentavos -= costoEnPesos * 100;
            usuario.ingrso_inicial = Math.floor(totalPesosCentavos / 100);
            usuario.ingreso_centavos = totalPesosCentavos % 100;
            
            usuario.ingrso_inicial_dolar = (usuario.ingrso_inicial_dolar || 0) + dolaresAComprar;
            usuario.ingreso_centavos_dolar = usuario.ingreso_centavos_dolar || 0;
            
            localStorage.setItem("usuario_logueado", JSON.stringify(usuario));
            
            const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
            const actualizados = usuarios.map(u => u.email === usuario.email ? usuario : u);
            localStorage.setItem("usuarios", JSON.stringify(actualizados));
            

            
            Swal.fire({
                icon: "success",
                title: "Transferencia realizada con exito",
                text: `Compra exitosa. Compraste ${dolaresAComprar} USD.`,
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                location.reload();
            }); 
        };
    };

    vender_dolar.onclick = () => {
        contenido2.innerHTML = `
            <h3>Venta de Dólares</h3>
            <div class="input-monto">
                <input type="number" id="dolar_vendido" step="1" min="0" placeholder="0">
                <span class="signo">.</span>
                <input type="number" id="centavo_dolar_vendido" min="0" max="99" placeholder="00">
                <span class="signo">USD</span>
            </div>
            <button class="btn btn-dark" id="venta">Vender</button>
        `;
            
        document.getElementById("venta").onclick = () => {
            const dolaresAVender = parseInt(document.getElementById("dolar_vendido").value) || 0;
            const centavosAVender = parseInt(document.getElementById("centavo_dolar_vendido").value) || 0;

            if (centavosAVender > 99 || centavosAVender < 0) {
                Swal.fire({
                    icon: "error",
                    title: "Los centavos deben estar entre 0 y 99",
                });
                return;
            }
            
            const totalVentaDolarCentavos = dolaresAVender * 100 + centavosAVender;
            const totalUsuarioDolarCentavos = (usuario.ingrso_inicial_dolar || 0) * 100 + (usuario.ingreso_centavos_dolar || 0);
            
            if (totalVentaDolarCentavos > totalUsuarioDolarCentavos) {
                Swal.fire({
                    icon: "error",
                    title: "Fondos insuficientes para esta venta",
                });
                return;
            }
            
            const tasaCambio = 1354;
            const pesosAGanarCentavos = totalVentaDolarCentavos * tasaCambio;
            
            let totalPesosActualCentavos = (usuario.ingrso_inicial || 0) * 100 + (usuario.ingreso_centavos || 0);
            totalPesosActualCentavos += pesosAGanarCentavos;
            usuario.ingrso_inicial = Math.floor(totalPesosActualCentavos / 100);
            usuario.ingreso_centavos = totalPesosActualCentavos % 100;
            
            const totalDolarRestanteCentavos = totalUsuarioDolarCentavos - totalVentaDolarCentavos;
            usuario.ingrso_inicial_dolar = Math.floor(totalDolarRestanteCentavos / 100);
            usuario.ingreso_centavos_dolar = totalDolarRestanteCentavos % 100;
            
            localStorage.setItem("usuario_logueado", JSON.stringify(usuario));
            const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
            const actualizados = usuarios.map(u => u.email === usuario.email ? usuario : u);
            localStorage.setItem("usuarios", JSON.stringify(actualizados));
            

            
            Swal.fire({
                icon: "success",
                title: "Transferencia realizada con exito",
                text: `Venta exitosa. Recibiste $${(pesosAGanarCentavos / 100).toFixed(2)} pesos`,
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                location.reload();
            }); 
        };
    };

    CBU.onclick = () => {
        contenido3.innerHTML = `<h1 class="display-1">Tu CBU es</h1>
        <p class="display-1">${usuario.CBU}</p>`
    }



    datos.onclick = () => {
    contenido3.innerHTML = `
        <h3>Editar datos</h3>
        <label>Nombre actual: ${usuario.nombre}</label><br>
        <input type="text" id="nuevo_nombre" placeholder="Nuevo nombre"><br>
        <button class="btn btn-dark my-2" id="cambiar_nombre">Cambiar nombre</button>
        <hr>
        <input type="password" id="nueva_contrasena" placeholder="Nueva contraseña"><br>
        <input type="password" id="confirmar_contrasena" placeholder="Confirmar contraseña"><br>
        <button class="btn btn-dark my-2" id="cambiar_contrasena">Cambiar contraseña</button>
        <hr>
        <button class="btn btn-secondary" id="atras">Atrás</button>
        <button class="btn btn-danger" id="borrar_datos">Borrar cuenta</button>
    `;

    // Cambiar solo el nombre
    document.getElementById("cambiar_nombre").onclick = () => {
        const nuevoNombre = document.getElementById("nuevo_nombre").value.trim();
        if (!nuevoNombre) {
            Swal.fire({
                icon: "error",
                title: "El campo está vacío",
            });
            return;
        }

        usuario.nombre = nuevoNombre;
        actualizarUsuario();

        Swal.fire({
            icon: "success",
            title: "Nombre actualizado",
            showConfirmButton: false,
            timer: 1500
        }).then(() => location.reload());
    };

    document.getElementById("cambiar_contrasena").onclick = () => {
        const nuevaContrasena = document.getElementById("nueva_contrasena").value.trim();
        const confirmarContrasena = document.getElementById("confirmar_contrasena").value.trim();

        if (!nuevaContrasena || !confirmarContrasena) {
            Swal.fire({
                icon: "error",
                title: "Complete ambos campos de contraseña",
            });
            return;
        }

        if (nuevaContrasena !== confirmarContrasena) {
            Swal.fire({
                icon: "error",
                title: "Las contraseñas no coinciden",
            });
            return;
        }

        if (!validarContrasenaSegura(nuevaContrasena)) {
            Swal.fire({
                icon: "error",
                title: "Contraseña insegura",
                text: "Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo",
            });
            return;
        }

        usuario.password = nuevaContrasena;
        actualizarUsuario();

        Swal.fire({
            icon: "success",
            title: "Contraseña actualizada",
            showConfirmButton: false,
            timer: 1500
        }).then(() => location.reload());
    };


    document.getElementById("atras").onclick = () => location.reload();

    document.getElementById("borrar_datos").onclick = () => {
        Swal.fire({
            title: "¿Seguro que deseas borrar tu cuenta?",
            text: "Esta cuenta se borrará de la página",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, estoy seguro"
        }).then((result) => {
            if (result.isConfirmed) {
                const restantes = usuarios.filter(u => u.email !== usuario.email);
                localStorage.setItem("usuarios", JSON.stringify(restantes));
                localStorage.removeItem(`mensajes_log_${usuario.email}`);
                localStorage.removeItem("usuario_logueado");
                Swal.fire({
                    title: "Fue borrado",
                    text: "Su cuenta fue borrada.",
                    icon: "success"
                }).then(() => {
                    location.href = "/index.html";
                });
            }
        });
    };
};


    historial.onclick = () => {
        contenido3.innerHTML = `
            <div id="mensaje-log" class="mensaje-log"></div>
            <button type="button" class="btn btn-dark mt-3" id="borrar_historial">Borrar historial</button>
        `;

        const clave = `mensajes_log_${usuario.email}`;
        const mensajes = JSON.parse(localStorage.getItem(clave)) || [];

        const log = document.getElementById("mensaje-log");
        if (mensajes.length === 0) {
            log.innerHTML = `<p>No hay ningún movimiento</p>`;
        } else {
            let tablaHTML = `
                <table class="table table-dark table-hover">
                    <thead>
                        <tr><th>Fecha</th><th>Hora</th><th>Movimiento</th></tr>
                    </thead>
                    <tbody>
            ` + mensajes.map(msg => `
                <tr>
                    <td>${msg.dia}</td>
                    <td>${msg.fecha}</td>
                    <td>${msg.texto}</td>
                </tr>
            `).join("") + `</tbody></table>`;
            log.innerHTML = tablaHTML;
        }

        document.getElementById("borrar_historial").onclick = () => {
            Swal.fire({
                title: "¿Esta seguro de borrar su historial?",
                text: "Se borrara su historial",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "SI"
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem(clave);
                    log.innerHTML = `<p>Historial eliminado.</p>`;
                    Swal.fire({
                        title: "Historial borrado",
                        icon: "success"
                    });
                }
            });
        };
    };

    function actualizarUsuario() {
        const nuevosUsuarios = usuarios.map(u => u.email === usuario.email ? usuario : u);
        localStorage.setItem("usuarios", JSON.stringify(nuevosUsuarios));
        localStorage.setItem("usuario_logueado", JSON.stringify(usuario));
    }

    function actualizarUsuarios(receptor) {
        const nuevos = usuarios.map(u => {
            if (u.email === usuario.email) return usuario;
            if (u.email === receptor.email) return receptor;
            return u;
        });
        localStorage.setItem("usuarios", JSON.stringify(nuevos));
        localStorage.setItem("usuario_logueado", JSON.stringify(usuario));
    }

    function guardarMensajeReceptor(email, texto) {
        const clave = `mensajes_log_${email}`;
        let mensajes = JSON.parse(localStorage.getItem(clave)) || [];
        mensajes.push({
            dia: new Date().toLocaleDateString(),
            fecha: new Date().toLocaleTimeString(),
            texto: texto
        });
        localStorage.setItem(clave, JSON.stringify(mensajes));
    }
});

