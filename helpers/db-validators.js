const Usuario = require('../models/usuario');
const Role = require("../models/role");
const Categoria = require("../models/categoria");
const Producto = require("../models/producto");


const esRolValido = async (rol = '') => {
    const existeRole = await Role.findOne({rol});
    if (!existeRole){
        throw new Error(`El rol ${rol} no estaba registrado en la BD`);
    }
}

const esCorreoValido = async (correo = '') => {
    const existeEmail = await Usuario.findOne({correo});
    if (existeEmail) {
        throw new Error(`El correo ${correo} estaba registrado en la BD`);
    }
}

const existeUsuarioPorId = async (id) => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id not esta registrado en la BD`);
    }
}

const existeCategoriaPorId = async (id) => {
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`El id not esta registrado en la BD`);
    }
}

const existeProductoPorId = async (id) => {
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El id not esta registrado en la BD`);
    }
}


// la forma de esta llamada debe retorna true
const coleccionPermitidas = (coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes(coleccion);

    if (!incluida) {
        throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`);
    }

    return true;
}


module.exports = {
    esRolValido,
    esCorreoValido,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionPermitidas
}