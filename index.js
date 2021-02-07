// Desarrollo de una aplicación web Express sobre productos asturianos - Jorge Gómez Tortosa (2 DAW)

// Librerías
const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const methodOverride = require('method-override');

// Enrutadores
const productos = require(__dirname + '/routes/productos');
const publico = require(__dirname + '/routes/publico');
const auth = require(__dirname + '/routes/auth');

// Conexión con la BD
mongoose.connect('mongodb://localhost:27017/ProdAsturianosV3', { useNewUrlParser: true });

// Servidor Express
let app = express();

// Configuramos motor Nunjucks
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// Asignación del motor de plantillas
app.set('view engine', 'njk');

// Cargar middleware body-parser para peticiones POST y PUT
// y enrutadores, se pone en vez de body-parser, express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para procesar otras peticiones que no sean GET o POST
app.use(methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

// Configuración de la sesión en la aplicación
// Es importante poner este middleware ANTES de cargar
// los enrutadores con app.use, para que éstos tengan
// esta configuración aplicada
app.use(session({
    secret: '1234',
    resave: true,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Cargamos ahora también la carpeta "public" para el CSS propio
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/', publico);
app.use('/admin', productos);
app.use('/auth', auth);

// Puesta en marcha del servidor
app.listen(8080);