const express = require('express');
const encriptado = require("crypto-js/sha256");

let Usuario = require(__dirname + '/../models/usuario.js');
let router = express.Router();

router.get('/login', (req, res) => {
    res.render('auth_login');
});

router.post('/login', (req, res) => {
    Usuario.find({
        usuario: req.body.usuario, 
        password: encriptado(req.body.password).toString()
    }).then(resultado => {
        if (resultado.length > 0) {
            req.session.usuario = resultado;
            res.redirect('/admin');
        } else {
            res.render('auth_login', {error: "Usuario incorrecto"});
        }
    }).catch(error => {
        res.render('admin_error');
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});
   
module.exports = router;