const  dbValidators = require('./db-validators');
const  generarJWT = require('./generar-jwt');
const  googleVerify = require('./google-verify');
const  subirArchivo = require('./subir-archivo');


// con esto se logra expandir todo el contenido
module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo,
}
