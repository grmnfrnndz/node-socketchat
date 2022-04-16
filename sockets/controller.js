const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers");
const { ChatMensaje } = require("../models");

const chatMensaje = new ChatMensaje();

const socketController = async (socket = new Socket(), io) => {
    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);

    if (!usuario) {
        return socket.disconnected();
    }

    console.log('Cliente conectado.', socket.id, usuario.nombre); 

    // agregar usuario
    chatMensaje.conectarUsuario(usuario);
    // emitir usuario conectado
    io.emit('usuarios-activos', chatMensaje.usuariosArr);
    // emitir ultimos 10 mensajes del chat
    io.emit('recibir-mensajes', chatMensaje.ultimos10);

    // creando la sala de chat
    socket.join(usuario.id); // global - socket.id, usuario.id (tres salas posibles)

    socket.on('disconnect', async () =>{
        // console.log('Cliente desconectado.', socket.id); 
        // limpiar cuando un usuario se desconecta
        chatMensaje.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensaje.usuariosArr);
    });

    socket.on('enviar-mensaje', ({uid, mensaje}) =>{

        if (uid) {
            // mensaje privado
            socket.to(uid).emit('mensaje-privado', {de: usuario.nombre, mensaje});
        } else {
            // mensaje general
            chatMensaje.enviarMensaje(usuario.id, usuario.nombre, mensaje); 
            io.emit('recibir-mensajes', chatMensaje.ultimos10);
        }

    });
}

module.exports = {
    socketController
}
