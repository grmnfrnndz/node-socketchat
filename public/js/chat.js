
let usuario = null;
let socket = null;


// referencias html
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');



const url = (window.location.hostname.includes('localhost')) 
? 'http://localhost:8080/api/auth/'
: 'https://node-webrestserver.herokuapp.com/api/auth/';


const validarJWT = async () => {
    const token = localStorage.getItem("token") || "";

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch(url, { 
        headers: {'x-token': token}
    });

    const { msg, usuario: usuarioDB, token: tokenDB } = await resp.json();
    // console.log(usuarioDB, tokenDB);
    localStorage.setItem("token", token);

    usuario = usuarioDB;
    document.title = usuario.nombre;

    await conectarSocket();

}

const conectarSocket = async () => {

    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Socket Online.');

    });

    socket.on('disconnect', () => {
        console.log('Socket OffLine.');
    });


    socket.on('recibir-mensajes', dibujarMensajes);

    socket.on('usuarios-activos', dibujarUsuarios);

    socket.on('mensaje-privado', dibujarMensajePrivado);

}

const dibujarUsuarios = (usuarios = []) => {

    let usersHtml = '';
    usuarios.forEach(({nombre, uid}) => {
        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success">${nombre}</h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `;
    });

    ulUsuarios.innerHTML = usersHtml;
    
}

const dibujarMensajes = (mensajes = []) => {

    let mensajesHtml = '';

    mensajes.forEach(({uid, nombre, mensaje}) => {
        mensajesHtml += `
            <li>
                <p>
                    <span class="text-primary">${nombre}: </span>
                    <span>${mensaje}</span>
                </p>
            </li>
        `;
    });

    ulMensajes.innerHTML = mensajesHtml;
    
}

const dibujarMensajePrivado = ({de, mensaje}) => {

    let li = document.createElement('li');

    let ilMensajePrivado = `
        <p>
            <span class="text-danger">${de}: </span>
            <span>${mensaje}</span>
        </p>
    `;

    li.innerHTML = ilMensajePrivado;
    ulMensajes.appendChild(li);
}


txtMensaje.addEventListener('keyup', ({keyCode}) => {
    const mensaje = txtMensaje.value;
    const uid = txtUid.value;

    if (keyCode !== 13) {return;}
    if (mensaje.length === 0) {return;}

    socket.emit('enviar-mensaje', {mensaje, uid});

    txtMensaje.value = '';
});



const main = async () => {
    await validarJWT();
}


main();


// // coneccion con el socket
// const socket = io();


