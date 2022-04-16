const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const Usuario = require('../models/usuario');

const validarJWT = async(req=request, res=response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPUBLICKEY);
        
        const usuario = await Usuario.findById(mongoose.Types.ObjectId(uid));

        // verificando que el usuario existe
        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no valido --'
            });
        }

        // verificar que si el uid tiene estado true
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no valido -'
            });
        }

        // se agrega al req
        // creando una propiedad nueva
        req.usuario = usuario;
    
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: 'Token no valido'
        });
    }
}

module.exports = {
    validarJWT
}

