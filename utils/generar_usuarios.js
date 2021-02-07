const mongoose = require('mongoose');
const Usuario = require(__dirname + '/../models/usuario');
const encriptado = require('crypto-js/SHA256');

mongoose.connect('mongodb://localhost:27017/ProdAsturianosV3');

Usuario.collection.drop();

let usu1 = new Usuario({
    usuario: 'jorge',
    password: encriptado('12345678').toString()
});
usu1.save();

let usu2 = new Usuario({
    usuario: 'jordi',
    password: encriptado('87654321').toString()
});
usu2.save();