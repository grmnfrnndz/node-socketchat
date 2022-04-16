const {Router} = require('express');
const { check } = require('express-validator');


const {validarCampos, validarArchivoSubir} = require('../middlewares');
const { cargarArchivo, actualizarImg, mostrarImagen, actualizarImgCloudinary, mostrarImagenCloudinary } = require('../controllers/upload');
const { route } = require('express/lib/application');
const { coleccionPermitidas } = require('../helpers');

const router = Router();

router.get('/:coleccion/:id', [
    check('id', 'El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom(c=> coleccionPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], 
// mostrarImagen);
mostrarImagenCloudinary);

// crear
router.post('/',[
    validarArchivoSubir
], cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivoSubir, 
    check('id', 'El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom(c=> coleccionPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
],
// actualizarImg);
actualizarImgCloudinary);


module.exports = router;