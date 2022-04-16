const {Router} = require('express');
const { check } = require('express-validator');

const { crearCategoria, borrarCategoria, 
    actualizarCategoria, obtenerCategoria, 
    obtenerCategorias } = require('../controllers/categoria');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const {validarCampos, validarJWT, tieneRole, esAdminRol} = require('../middlewares');

const router = Router();


/**
 * {{url}}/api/categoria
 */

// Obtener todas las categorias - publico
router.get('/', obtenerCategorias);

// Obtener categoria por id - publico
router.get('/:id', 
[
    check('id', 'No es un ID valido').isMongoId(),
    validarCampos,
    check('id').custom( existeCategoriaPorId ),
    validarCampos
],
obtenerCategoria);

// Crear categoria - privado - cualquier persona con un token valido
router.post('/', 
[
    validarJWT,
    check('nombre', 'El nombre es obrigatorio').not().isEmpty(),
    validarCampos
],
crearCategoria);

// Actualizar categoria - privado - cualquier persona con un token valido
router.put('/:id', 
[
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    validarCampos,
    check('id').custom(existeCategoriaPorId),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
],
actualizarCategoria);

// Borrar categoria - privado - cualquier persona con un token valido - admin
router.delete('/:id', 
[
    validarJWT,
    // tieneRole('ADMIN_ROLE'),
    esAdminRol,
    check('id', 'No es un ID valido').isMongoId(),
    validarCampos,
    check('id').custom(existeCategoriaPorId),
    validarCampos
],
borrarCategoria);

module.exports = router;
