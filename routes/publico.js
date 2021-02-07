const express = require('express');

let Producto = require(__dirname + '/../models/producto.js');
let router = express.Router();

router.get('/', (req, res) => {
    res.render('publico_index');
});

router.get('/buscar', (req, res) => {
    if (req.query.buscar !== '') {
        Producto.find({nombre: new RegExp(req.query.buscar, 'i')}).then(resultado => {
            if (resultado.length > 0)
                res.render('publico_index', { productos: resultado });
            else
                res.render('publico_index', { error: "No se encontraron productos" });
        }).catch(error => {
            res.render('publico_error');
        });
    } else {
        res.redirect('/');
    }
});

router.get('/producto/:id', (req, res) => {
    Producto.findById(req.params.id).then(resultado => {
        if (resultado) {
            res.render('publico_producto', {producto: resultado});
        } else {
            res.render('publico_error', {error: "Producto no encontrado"});
        }
    }).catch(error => {
        res.render('publico_error', {error: "Producto no encontrado"});
    });
});

router.post('/comentarios/:id', (req, res) => {
    Producto.findById(req.params.id).then(producto => {
        producto.comentarios.push({
            usuario: req.body.usuario,
            comentario: req.body.comentario
        });
        producto.save().then(resultado => {
            res.render('publico_producto', {producto: resultado});
        });
    }).catch(error => {
        res.render('publico_error');
    });
});

module.exports = router;