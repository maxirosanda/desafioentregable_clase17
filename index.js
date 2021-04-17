var fs = require('fs');
var express = require('express');
var moduloLeer = require('./modulos/modulosCrud/moduloLeer');
var moduloLeerChat = require('./modulos/moduloLeerChat');
var moduloGuardarChat = require('./modulos/moduloGuardarChat');
var app = express();
var router = express.Router();
var handlebars = require('express-handlebars');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//----------------------------------------------
var http = require('http').Server(app);
var io = require('socket.io')(http);
//------------------------
const {options} = require('./options/mariaDB')
const knex= require('knex')(options)
//-------------------------------
var arreglo = [];
var arreglocarrito = [];
var admin = true
// configuracion handlebars
app.engine('hbs', handlebars({
    extname: ".hbs",
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials/'
}));
app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.static("public"));



//------------------------- Agregar Producto vista------------------------------
router.get(`/productos/agregar`, function (req, res) {
if(admin){
    res.status(200).render('agregar_producto');
}
if(!admin){
    res.status(200).render('Acceso_denegado')
}  
})

//------------------------------Guardar Producto---------------------------------------


router.post(`/productos/`, function (req, res) {
    if(admin){
    knex('productos').insert({Nombre:req.body.nombre,descripcion:req.body.des,codigo:req.body.cod,url:req.body.url,precio:req.body.precio,stock:req.body.stock})
    .then (()=>console.log('data inserted'))
    .catch((err)=>{console.log(err); throw err})
    .finally(()=>{
        knex.destroy();
        res.status(200).redirect(`/productos/agregar`)
    })
    } 
    if(!admin){
        res.status(400).json( { error : -1, descripcion: 'ruta /productos/ método post no autorizada'})
    }
});
  
//-----------------------Producto individual vista------------------------------------    
    router.get(`/productos/listar/:id`, function (req, res) {
        var id = parseInt(req.params.id)
        if(admin){
            
            knex.from('productos').select('*').where('Id',id)
            .then((rows)=>{
                for(row of rows){
                console.log(JSON.stringify(row))
                res.status(200).render('listar_producto', { arreglo:JSON.stringify(row), listExists: true })
            }
            })
            .catch(()=>{
                return res.status(400).json({ "error": "Producto no encontrado" })
            })
            .finally(()=>{
                knex.destroy()
            })     
    }
    if(!admin){
        res.status(200).render('Acceso_denegado')
    }
    })


//------------------------------Actualizar Producto---------------------------------------
router.put(`/productos/:id`, function (req, res) {
    let id =parseInt(req.params.id)
    if(admin){
    knex.from('productos').where('Id',id).update({Nombre:req.body.nombre,descripcion:req.body.des,codigo:req.body.cod,url:req.body.url,precio:req.body.precio,stock:req.body.stock})
        .then (()=>console.log('producto update'))
        .catch((err)=>{console.log(err); throw err})
        .finally(()=>{
            res.status(200).json("actualizado")
            knex.destroy();
    })

}
if(!admin){
    res.status(400).json( { error : -1, descripcion: 'ruta /productos/:id método put no autorizada'})
}
});
//-------------------------------Borrar Producto-------------------------------------
router["delete"](`/productos/:id`, function (req, res) {
    if(admin){
        knex.from('productos').where('Id',parseInt(req.params.id)).del()
            .then (()=>console.log('producto delete'))
            .catch((err)=>{console.log(err); throw err})
            .finally(()=>{
                res.status(200).json("Borrado")
                knex.destroy();
            })
    
}if(!admin){
    res.status(400).json( { error : -1, descripcion: 'ruta /productos/:id método delete no autorizada'})
}
});


//------------------------------Guardar en Carrito---------------------------------------
router.post(`/carrito`, function (req, res) {
    knex('carrito').insert({Id:req.body.id ,Nombre:req.body.nombre,descripcion:req.body.des,codigo:req.body.cod,url:req.body.url,precio:req.body.precio,stock:req.body.stock})
    .then (()=>console.log('data inserted'))
    .catch((err)=>{console.log(err); throw err})
    .finally(()=>{
        res.status(200).redirect(`/carrito/listar`)
        knex.destroy();
        
    })
    })
//-----------------------------Ver carrito----------------------------------------
moduloLeer.leer(fs,`./datos/carrito.js`).then(function (guardados) {
    
    if (guardados)
    arreglocarrito = JSON.parse(guardados);
        router.get(`/carrito/listar`, function (req, res) {
        res.status(200).render('listar_carrito', { arreglo: arreglocarrito, listExists: true })
    });
})

   //-----------------------Producto individual vista------------------------------------
   moduloLeer.leer(fs,`./datos/productos.js`).then(function (guardados) {
    if (guardados)
    arreglo = JSON.parse(guardados);
      
   router.get(`/carrito/agregar/:id`, function (req, res) {
    
    var id = parseInt(req.params.id);
    var existe = false;
    arreglo.forEach(function (element, index) {
        if (element.id == id) {
            res.status(200).render('agregar_carrito', { arreglo: arreglo[index], listExists: true });
            existe = true;
        }
    });
    if (!existe) {
        return res.status(400).json({ "error": "Producto no encontrado" });
    }

});
});

//-------------------------------Borrar carrito-------------------------------------
router["delete"](`/carrito/:id`, function (req, res) {
    knex.from('carrito').where('Id',parseInt(req.params.id)).del()
    .then (()=>console.log('producto delete'))
    .catch((err)=>{console.log(err); throw err})
    .finally(()=>{
        res.status(200).json("Borrado")
        knex.destroy();
    })
});

//---------------------------conexion servidor------------------------------------------------
app.use('/', router);
app.use(express.static('public'));
var port = 8080;
var server = app.listen(port, function () {
    console.log("Example app listening at http://localhost:" + port);
});
server.on("error", function (error) { return console.log("error en servidor " + error); });

//--------------------socket--------------------------------------------------
http.listen(3000, function () { return console.log('SERVER ON'); });

//-------------------------------------------------------------------------
router.get('/chat', function (req, res) {
    res.status(200).render('./partials/chat');
});
router.get('/lista2', function (req, res) {
    res.status(200).render('./partials/lista');
});
//-------------------------------------
io.on('connection', function (socket) {
    console.log('¡Nuevo cliente conectado!');
    moduloLeerChat.leer(fs).then(function (guardados) {
        socket.emit('vermensajes', JSON.parse(guardados));
    });
    socket.on('paquete', function (data) {
        moduloGuardarChat.guardar(data.mail, data.mensaje, data.fecha, fs);
    });
    moduloLeer.leer(fs,`./datos/productos.js`).then(function (guardados) {
        socket.emit('lista', JSON.parse(guardados));
    });
    moduloLeer.leer(fs,`./datos/carrito.js`).then(function (guardados) {
        socket.emit('lista_carrito', JSON.parse(guardados));
    });
});
