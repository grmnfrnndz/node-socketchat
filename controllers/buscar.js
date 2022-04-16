const { request, response } = require("express");
const { ObjectId } = require("mongoose").Types;

const {Usuario, Producto, Categoria, Role} = require("../models");

const coleccionesPermitidas = [
    'usuarios', 
    'categoria', 
    'producto', 
    'roles'
]

const buscarUsuario = async (termino = '', res=response) => {
    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : [],
        });
    }

    const regex = new RegExp(termino, 'i');

    // retona una arreglo
    const usuarios = await Usuario.find({
        $or: [{nombre: regex}, {correo: regex}],
        $and:[{estado: true}]
    });

    return res.json({
        results: usuarios
    });
}

const buscarCategorias = async (termino = '', res=response) => {
    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : [],
        });
    }

    const regex = new RegExp(termino, 'i');

    // retona una arreglo
    const categorias = await Categoria.find({nombre: regex, estado: true});

    return res.json({
        results: categorias
    });
}


const buscarProductos = async (termino = '', res=response) => {
    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [producto] : [],
        });
    }

    const regex = new RegExp(termino, 'i');

    // retona una arreglo
    const productos = await Producto.find({nombre: regex, estado: true}).populate('categoria', 'nombre');

    return res.json({
        results: productos
    });
}


const buscar = (req=request, res=response) => {
    const {coleccion, termino} = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitdas son ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuario(termino, res);
            break;
        case 'categoria':
            buscarCategorias(termino, res);
            break;
        case 'producto':
            buscarProductos(termino, res);
            break;
        case 'roles':
            break;
        default:
            res.status(500).json({
                msg: 'Busqueda no implementada'
            })
            break;
    }
}

module.exports = {
    buscar
}