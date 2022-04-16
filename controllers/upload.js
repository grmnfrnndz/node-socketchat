const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { request, response } = require("express");
const { subirArchivo } = require("../helpers");

const { Usuario, Producto } = require("../models");



const cargarArchivo = async(req=request, res=response) => {
  
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
      res.status(400).json({msg: 'No files were uploaded'});
      return;
    }
  
    try {
        // Imagenes
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
        res.json({nombre});
    } catch (msg) {
        res.status(400).json({msg});
    }
}


const actualizarImg = async (req=request, res=response) => {

    const {coleccion, id} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {

                return res.status(400).json({
                    msg: `No existe el usuario ${id}.`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe el producto ${id}.`
                });
            }
            break;
        default:
            return res.status(400).json({msg: 'Esta accion no esta permitida.'});
    }

    try {
        // limpiar imagenes previas
        if (modelo.img) {
            // hay que borrar la imagen del servidor
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
            if (fs.existsSync(pathImagen)) {
                fs.unlinkSync(pathImagen);
            }
        }

        // Imagenes
        const nombre = await subirArchivo(req.files, undefined, coleccion);
        modelo.img = nombre;
        await modelo.save();
        
        res.json(modelo);
    } catch (msg) {
        console.log(msg);
        res.status(400).json({msg});
    }
}

const actualizarImgCloudinary = async (req=request, res=response) => {

    const {coleccion, id} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {

                return res.status(400).json({
                    msg: `No existe el usuario ${id}.`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe el producto ${id}.`
                });
            }
            break;
        default:
            return res.status(400).json({msg: 'Esta accion no esta permitida.'});
    }

    try {
        // limpiar imagenes previas
        if (modelo.img) {
            const nombreArr = modelo.img.split('/');
            const nombre = nombreArr[nombreArr.length -1];
            const [public_id] = nombre.split('.');
            cloudinary.uploader.destroy(public_id);
        }

        const { tempFilePath } = req.files.archivo;

        const {secure_url} = await cloudinary.uploader.upload(tempFilePath);

        modelo.img = secure_url;
        await modelo.save();
        
        res.json(modelo);
    } catch (msg) {
        console.log(msg);
        res.status(400).json({msg});
    }
}


const mostrarImagen = async (req=request, res=response) => {

    const {coleccion, id} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {

                return res.status(400).json({
                    msg: `No existe el usuario ${id}.`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe el producto ${id}.`
                });
            }
            break;
        default:
            return res.status(400).json({msg: 'Esta accion no esta permitida.'});
    }

    try {
        // limpiar imagenes previas
        if (modelo.img) {
            // hay que borrar la imagen del servidor
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
            if (fs.existsSync(pathImagen)) {
                return res.sendFile(pathImagen);
            }
        }
        
        const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
        res.sendFile(pathImagen);
    } catch (msg) {
        console.log(msg);
        res.status(400).json({msg});
    }
}


const mostrarImagenCloudinary = async (req=request, res=response) => {

    const {coleccion, id} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {

                return res.status(400).json({
                    msg: `No existe el usuario ${id}.`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe el producto ${id}.`
                });
            }
            break;
        default:
            return res.status(400).json({msg: 'Esta accion no esta permitida.'});
    }

    try {
        // limpiar imagenes previas

        let img = 'https://res.cloudinary.com/dwzeydb7o/image/upload/v1649907144/no-image_q3k4ma.jpg';

        if (modelo.img) {
            img = modelo.img;
        }
        
        res.json({img});
    } catch (msg) {
        console.log(msg);
        res.status(400).json({msg});
    }
}

module.exports = {
    cargarArchivo,
    actualizarImg,
    mostrarImagen,
    actualizarImgCloudinary,
    mostrarImagenCloudinary
}