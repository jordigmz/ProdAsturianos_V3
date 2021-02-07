const express = require('express');
const multer = require('multer');

let autenticacion = require(__dirname + '/../utils/auth.js');
let Producto = require(__dirname + '/../models/producto.js');
let router = express.Router();

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    }
}); 

let upload = multer({storage: storage});

router.get('/', autenticacion, (req, res) => {
    Producto.find().then(resultado => {
        res.render('admin_productos', {productos: resultado});
    }).catch(error => {
        res.render('admin_error');
    });
});

router.get('/nuevo', autenticacion, (req, res) => {
    res.render('admin_productos_form');
});

router.get('/editar/:id', autenticacion, (req, res) => {
    Producto.findById(req.params.id).then(resultado => {
        if (resultado) {
            res.render('admin_productos_form', {producto: resultado});
        } else {
            res.render('admin_error', {error: "Producto no encontrado"});
        }
    }).catch(error => {
        res.render('admin_error', {error: "Producto no encontrado"});
    });
});

router.post('/', autenticacion, upload.single('imagen'), (req, res) => {
    let nuevoProducto = new Producto({
        nombre: req.body.nombre,
        precio: req.body.precio,
        descripcion: req.body.descripcion
    });

    if (typeof req.file === 'undefined'){
        nuevoProducto.imagen = "thumbnail.png";
    } else {
        nuevoProducto.imagen = req.file.filename;
    }

    nuevoProducto.save().then(resultado => {
        res.redirect('/');
    }).catch(error => {
        res.render('admin_error');
    });
});

router.post('/:id', autenticacion, upload.single('imagen'), (req, res) => {
    if (typeof req.file !== 'undefined') {
        Producto.findByIdAndUpdate(req.params.id, {
            $set: {
                nombre: req.body.nombre,
                precio: req.body.precio,
                descripcion: req.body.descripcion,
                imagen: req.file.filename
            }
        }, { new: true }).then(resultado => {
            res.redirect('/');
        }).catch(error => {
            res.render('admin_error');
        });
    } else {
        Producto.findByIdAndUpdate(req.params.id, {
            $set: {
                nombre: req.body.nombre,
                precio: req.body.precio,
                descripcion: req.body.descripcion
            }
        }, { new: true }).then(resultado => {
            res.redirect('/');
        }).catch(error => {
            res.render('admin_error');
        });
    }
});

router.delete('/:id', autenticacion, (req, res) => {
    Producto.findByIdAndRemove(req.params.id).then(resultado => {
        res.redirect('/');
    }).catch(error => {
        res.render('admin_error', {error: "Error eliminando el producto"});
    });
});

router.get('/comentarios/:idProducto', autenticacion, (req, res) => {
    Producto.findById(req.params.idProducto).then(resultado => {
        res.render('admin_comentarios', { producto: resultado });
    }).catch(error => {
        res.render('admin_error');
    });
});

router.delete('/comentarios/:idProducto/:idComentario', autenticacion, (req, res) => {
    Producto.findById(req.params.idProducto).then(producto => {
        if (producto.comentarios.length > 0) {
            let comentariosCreados = producto.comentarios.length;

            producto.comentarios = producto.comentarios.filter(comentario => comentario._id != req.params.idComentario);

            if (producto.comentarios.length < comentariosCreados) {
                producto.save().then(resultado => {
                    res.render('admin_comentarios', {producto: resultado});
                });
            } else {
                res.render('admin_error');
            }
        } else {
            res.render('admin_error');
        }
    }).catch(error => {
        res.render('admin_error');
    });
});

module.exports = router;