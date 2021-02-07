/* Incluye el módulo mongoose y define los esquemas y modelos de comentario y producto. */

const mongoose = require('mongoose');

let comentarioSchema = new mongoose.Schema({
    usuario: {
        require: true,
        type: String,
        trim: true
    },
    comentario: {
        type: String,
        require: true,
        minlength: 5,
        trim: true
    }
});

let productoSchema = new mongoose.Schema({
    nombre: {
        required: true,
        type: String,
        minlength: 3,
        trim: true
    },
    precio: {
        required: true,
        type: Number,
        min: 1
    },
    descripcion: {
        required: true,
        type: String,
        trim: true
    },
    imagen: {
        required: false,
        type: String,
        trim: true
    },
    comentarios: [
        comentarioSchema
    ]
});

let Producto = mongoose.model('producto', productoSchema);
module.exports = Producto;