const {Router} = require('express');
const { check } = require('express-validator');

const { crearProducto, borrarProducto, 
    actualizarProducto, obtenerProducto, 
    obtenerProductos } = require('../controllers/producto');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');
const {validarCampos, validarJWT, esAdminRol} = require('../middlewares');

const router = Router();


/**
 * {{url}}/api/producto
 */

// Obtener todas los productos - publico
router.get('/', obtenerProductos);

// Obtener producto por id - publico
router.get('/:id', 
[
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
],
obtenerProducto);

// Crear producto - privado - cualquier persona con un token valido
router.post('/', 
[
    validarJWT,
    check('nombre', 'El nombre es obrigatorio').not().isEmpty(),
    check('categoria', 'No es un id de mongo').isMongoId(),
    validarCampos,
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
],
crearProducto);

// Actualizar producto - privado - cualquier persona con un token valido
router.put('/:id', 
[
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    validarCampos,
    check('id').custom(existeProductoPorId),
    validarCampos
],
actualizarProducto);

// Borrar producto - privado - cualquier persona con un token valido - admin
router.delete('/:id', 
[
    validarJWT,
    esAdminRol,
    check('id', 'No es un ID valido').isMongoId(),
    validarCampos,
    check('id').custom(existeProductoPorId),
    validarCampos
],
borrarProducto);

module.exports = router;
