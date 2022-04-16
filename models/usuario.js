const {Schema, model} = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'required field'],

    }, 
    correo: {
        type: String,
        required: [true, 'required field'],
        unique: true
    }, 
    password: {
        type: String,
        required: [true, 'required field'],
    }, 
    img: {
        type: String,
    }, 
    rol: {
        type: String,
        required: [true, 'required field'],
        // enum: ['ADMIN_ROLE', 'USER_ROLE']
        default: 'USER_ROLE'
    }, 
    estado: {
        type: Boolean,
        default: true
    }, 
    google: {
        type: Boolean,
        default: false
    }
});


UsuarioSchema.methods.toJSON = function () {
    const {__v, _id, password, ...usuario} = this.toObject();
    usuario.uid = _id;
    return usuario;
}

// el primer campo corresponde a la coleccion, mongo agrega la s al final para llevar de singular a plural
module.exports = model('Usuario', UsuarioSchema);
