const { request, response } = require('express');
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');


const Usuario = require('../models/usuario');


const usuariosGet = async (req=request, res=response) => {

    // const {q, nombre = 'No Name', apiKey, page=1, limit} = req.query;
    const query = {estado:true};
    const {limite=5, desde=0} = req.query;
    // const usuarios = await Usuario.find(query)
    // .skip(Number(desde))
    // .limit(Number(limite))
    // ;
    // const total = await Usuario.countDocuments(query);


    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPut = async (req=request, res=response) => {
    const id = req.params;
    // importante quitar el _id para no afectar a una referencia objectid
    const {_id, password, google, correo, ...resto} = req.body;

    // TODO validar contra BD
    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(mongoose.Types.ObjectId(id), resto);

    res.json(usuario);
}

const usuariosPost = async(req=request, res=response) => {
    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});

    // encriptar el password
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //Guardar DB
    await usuario.save();

    

    res.status(201).json({
        ok: true,
        msg: 'post API controller',
        usuario
    });
}

const usuariosDelete = async (req=request, res=response) => {

    const id = req.params;
    const usuarioAuthenticado = req.usuario;

    // con este metodo perdemos la referencia del usuario con los datos
    // const usuario = await Usuario.findByIdAndDelete(mongoose.Types.ObjectId(id));

    // para una eliminacion es recomendable cambiar el estado del registro (estado=false)
    const usuario = await Usuario.findByIdAndUpdate(mongoose.Types.ObjectId(id), {estado:false});
    

    res.json({
        usuario,
        usuarioAuthenticado,
    }
    );
}

const usuariosPatch = (req=request, res=response) => {
    res.json({
        ok: true,
        msg: 'patch API controller'
    });
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}