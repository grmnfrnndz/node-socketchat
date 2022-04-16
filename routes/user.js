const {Router} = require('express');
const { check } = require('express-validator');

const { usuariosGet, usuariosPut, 
    usuariosPost, usuariosDelete,
    usuariosPatch } = require('../controllers/user');

    
const { esRolValido, esCorreoValido, existeUsuarioPorId } = require('../helpers/db-validators');    

// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRol, tieneRole } = require('../middlewares/validar-roles');

const {validarCampos, validarJWT, esAdminRol, tieneRole} = require('../middlewares');


const router = Router();

router.get('/', usuariosGet);

router.put('/:id',
[
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRolValido),
    validarCampos
]
, usuariosPut);

router.post('/',
// middlewares de validacion
[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio, debe tener mas 6 letras').isLength({min: 6}),
    check('correo', 'El correo no es valido').isEmail(),
    // check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRolValido),
    check('correo').custom(esCorreoValido),
    validarCampos

]
, usuariosPost);

router.delete('/:id', [
    validarJWT,
    // esAdminRol,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;
