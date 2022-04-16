const {Schema, model} = require('mongoose');

const RoleSchema = Schema({

    rol: {
        type: String,
        required: [true, 'required field']
    }

});

// el primer campo corresponde a la coleccion, mongo agrega la s al final para llevar de singular a plural
module.exports = model('Role', RoleSchema);
