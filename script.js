const mensaje = document.getElementById('mensaje')
const dinero = document.getElementById('dinero')
let dineroInicial;
let usuarioInicial;

const usuario1 = {
    nombre: "Victor",
    apellido: "Dias",
    edad: 45,
    dinero_: 5000000,
    trabajo: "Banquero",
    pais_origen: "Estados Unidos",
    movimientos: "computadora: 300000 $, inversiones: 400000 $",
    ingresos_altos: true,
    constraseña:5061962
}
const usuario2 = {
    nombre: "Luke",
    apellido: "Banner",
    edad: 30,
    dinero_: 2000,
    trabajo: "Fisico",
    pais_origen: "Brasil",
    movimientos: "mecanico: 20000$,Leia Banner: 300000$",
    ingresos_altos: false,
    constraseña:2541977
}
const usuario3 = {
    nombre: "Bruce",
    apellido: "Connor",
    edad: 35,
    dinero_: 400000,
    trabajo: "Arquitecto",
    pais_origen: "Estados Unidos",
    movimientos: "Papeles:3000 $, unversidad:45000 $",
    ingresos_altos: true,
    constraseña:1051962
}
const usuario4 = {
    nombre: "Tomas",
    apellido: "Morales",
    edad: 24,
    dinero_: 500,
    trabajo: "Musico",
    pais_origen: "Puerto Rico",
    movimientos: "Guitarra: 30000 $, Mariana Morales: 40000 $",
    ingresos_altos: false,
    constraseña:4082011
}
const usuario5 = {
    nombre: "Alexander Jhosep",
    apellido: "Thurner",
    edad: 40,
    dinero_: 100000000,
    trabajo: "CEO de empresa",
    pais_origen: "Estados Unidos",
    movimientos: "computadora: 200000 $, circuitos: 550000 $, Inversiones: 30000 $",
    ingresos_altos: true,
    constraseña:2321940
}

const Usuarios = [usuario1, usuario2, usuario3, usuario4, usuario5]


let usuarioIngresado = prompt("Ingrese la su contraseña")
usuarioIngresado = Number(usuarioIngresado)

for(const usuario of Usuarios) {
    if (usuarioIngresado === usuario.constraseña) {
        const nombreCompleto = usuario.nombre + " " + usuario.apellido;

        let usuarioActual = usuarioInicial ?? nombreCompleto;
        mensaje.textContent = `Cliente: ${usuarioActual}`;
        
        const dineroPredeterminado = usuario.dinero_;

        let dineroActual = dineroInicial ?? dineroPredeterminado;
        dinero.textContent = `Usted tiene: ${dineroActual} $`;

        break;
    }
}



