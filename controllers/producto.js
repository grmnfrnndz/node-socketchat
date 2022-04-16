const { request, response } = require('express');
const { Producto } = require('../models');
const mongoose = require('mongoose');


const obtenerProductos = async (req=request, res=response) => {
    const query = {estado:true};
    const {limite=5, desde=0} = req.query;

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total,
        productos
    });
}

const obtenerProducto = async (req=request, res=response)=>{
    const {id} = req.params;
    const categoria = await Producto.findById(mongoose.Types.ObjectId(id))
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre');
    res.json(categoria);
}

const crearProducto = async(req=request, res=response)=>{
    const {estado, usuario, ...body} = req.body;
    const nombre = body.nombre.toUpperCase();
    // verificar si existe 
    const productoDB = await Producto.findOne({nombre});

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto existe ${nombre}`
        });
    }

    // generar la data a guardar
    const data = {
        ...body,
        nombre, 
        usuario: req.usuario._id,
    }

    const producto = await new Producto(data);

    // guardar la producto
    await producto.save();

    res.status(201).json(producto);
}

const actualizarProducto = async(req=request, res=response)=>{
    const {id} = req.params;
    const {_id, usuario, estado, ...resto} = req.body;
    
    // actualizando el nombre y indicando el usuario que lo actualiza
    if (resto.nombre){
       resto.nombre = resto.nombre.toUpperCase();
    }
    resto.usuario = req.usuario.uid;

    const categoria = await Producto.findByIdAndUpdate(mongoose.Types.ObjectId(id), resto, {new: true})
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre');
    res.json(categoria);
}

const borrarProducto = async (req=request, res=response) => {
    const {id} = req.params;
    const producto = await Producto.findByIdAndUpdate(mongoose.Types.ObjectId(id), {estado:false}, {new: true})
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre');
    res.status(200).json({producto});
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}
