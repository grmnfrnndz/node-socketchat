const { request, response } = require('express');
const { Categoria } = require('../models');
const mongoose = require('mongoose');


// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req=request, res=response) => {

    const query = {estado:true};
    const {limite=5, desde=0} = req.query;

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total,
        categorias
    });
}

// obtenerCategoria - populate
const obtenerCategoria = async (req=request, res=response)=>{
    const {id} = req.params;
    const categoria = await Categoria.findById(mongoose.Types.ObjectId(id)).populate('usuario', 'nombre');
    res.json(categoria);
}

const crearCategoria = async(req=request, res=response)=>{
    const nombre = req.body.nombre.toUpperCase();

    // verificar si existe 
    const categoriaDB = await Categoria.findOne({nombre});

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria existe ${nombre}`
        });
    }

    // generar la data a guardar
    const data = {
        nombre, 
        usuario: req.usuario._id,
    }

    const categoria = await new Categoria(data);

    // guardar la categoria
    await categoria.save();

    res.status(201).json(categoria);
}

// actualizarCategoria - populate - nombre
const actualizarCategoria = async(req=request, res=response)=>{
    const {id} = req.params;
    const {_id, usuario, estado, ...resto} = req.body;
    
    // actualizando el nombre y indicando el usuario que lo actualiza
    resto.nombre = resto.nombre.toUpperCase();
    resto.usuario = req.usuario.uid;

    const categoria = await Categoria.findByIdAndUpdate(mongoose.Types.ObjectId(id), resto, {new: true}).populate('usuario', 'nombre');
    res.json(categoria);
}

// borrarCategoria - populate - nombre
const borrarCategoria = async (req=request, res=response) => {
    const {id} = req.params;
    const categoria = await Categoria.findByIdAndUpdate(mongoose.Types.ObjectId(id), {estado:false}, {new: true}).populate('usuario', 'nombre');
    res.status(200).json({categoria});
}

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}
