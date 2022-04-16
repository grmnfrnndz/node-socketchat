const {Router} = require('express');
const { check } = require('express-validator');

const { loginPost, googleIndentity, renovarToken } = require('../controllers/auth');

const {validarCampos, validarJWT} = require('../middlewares');


const router = Router();



router.post('/login',
// middlewares de validacion
[
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('correo', 'El correo no es valido').isEmail(),
    validarCampos
]
, loginPost);


router.post('/google',
[
    check('id_token', 'El ID_TOKEN de google es necesario').not().isEmpty(),
    validarCampos
]
, googleIndentity);


router.get('/', [
    validarJWT
], renovarToken);


module.exports = router;
