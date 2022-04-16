const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


const loginPost = async(req=request, res=response) => {
    
    const { correo, password } = req.body;

    try {

        // verificar si el email existe 
        const usuario = await Usuario.findOne({correo})
        
        if (!usuario) {
            return res.status(400).json({
                msg: 'Datos invalidos'
            });
        }

        // Si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario Inactivo'
            });
        }

        // verificar la password
        const validPassword = bcryptjs.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                msg: 'Password Invalida'
            });
        }

        // Generar JWT
        const token = await generarJWT(usuario.id);


        res.status(201).json({
            usuario,
            token
        });

    } catch (error) {
        // Nunca deberia suceder este error
        console.log('Error:', error);
        res.status(500).json({
            msg: 'Contacte al administrador'
        });       
    }

}


const googleIndentity = async(req=request, res=response) => {
    const { id_token } = req.body;

    try {
        const {correo, nombre, img} = await googleVerify(id_token);

        // verificar email 
        let usuario = await Usuario.findOne({correo});

        if (!usuario) {
            // crear usuario
            const data = {
                nombre, 
                correo,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        // si el usuario en DB 
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Contactar al administrador - usuario bloqueado'
            });
        }

        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            ok: false,
            msg: 'El token no se pudo verificar'
        });
    }



}


const renovarToken = async (req=request, res=response) => {

    const {usuario} = req;

    const token = await generarJWT(usuario.id);

    res.json({
        usuario,
        token
    });

}


module.exports = {
    loginPost,
    googleIndentity,
    renovarToken
}