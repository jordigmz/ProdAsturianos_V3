/* Incluye el módulo mongoose y define los esquemas y modelos de usuario y password. */

const mongoose = require('mongoose');

let usuarioSchema = new mongoose.Schema({
    usuario: {
        required: true,
        type: String,
        minlength: 5,
        unique: true,
        trim: true
    },
    password: {
        required: true,
        type: String,
        minlength: 8,
        trim: true
    }
});

let Usuario = mongoose.model('usuario', usuarioSchema);
module.exports = Usuario;