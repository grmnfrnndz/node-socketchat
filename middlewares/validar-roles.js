const { request, response } = require('express');


const esAdminRol = (req=request, res=response, next) => {
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar sin validar el token primero'
        });
    }

    const { rol, nombre } = req.usuario;

    if ( rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
           msg: `${ nombre } no es admin.` 
        });
    }

    next();
}

 const tieneRole = (...roles ) => {
    return (req=request, res=response, next) => {
        console.log(roles);

        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar sin validar el token primero'
            });
        }

        if (!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: `El servicio require uno de estos roles ${roles}` 
             });
        }
        next();
    }
 }


module.exports = {
    esAdminRol,
    tieneRole
}

