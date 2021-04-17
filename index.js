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



//-------------------------Ruta para vista Agregar Producto ------------------------------
router.get(`/productos/agregar`, function (req, res) {
if(admin){
    res.status(200).render('agregar_producto');
}
if(!admin){
    res.status(200).render('Acceso_denegado')
}  
})
//--------- Ruta para Vista Listar todos los productos--------------------------------------
router.get(`/productos/listar`, function (req, res) {
    if(admin){
        res.status(200).render('listar_todos_productos');
    }
    if(!admin){
        res.status(200).render('Acceso_denegado')
    }  
    })

//-----------------------------Ruta vista carrito----------------------------------------

router.get(`/carrito/listar`, function (req, res) {
  
    res.status(200).render('listar_carrito')

})

//-----------------------Producto individual vista------------------------------------    
    router.get(`/productos/listar/:id`, function (req, res) {
        var id = parseInt(req.params.id)
        if(admin){
            
            knex.from('productos').select('*').where('Id',id)
            .then((rows)=>{
                for(row of rows){
                console.log(JSON.parse(JSON.stringify(row)))
                res.status(200).render('listar_producto', { arreglo:JSON.parse(JSON.stringify(row)), listExists: true })
            }
            })
            .catch(()=>{
                return res.status(400).json({ "error": "Producto no encontrado" })
            })
            .finally(()=>{
              //knex.destroy()
            })     
    }
    if(!admin){
        res.status(200).render('Acceso_denegado')
    }
    })

   //-----------------------Vista Agregar al carrito ------------------------------------


   router.get(`/carrito/agregar/:id`, function (req, res) {
    
    var id = parseInt(req.params.id);
    knex.from('productos').select('*').where('Id',id)
    .then((rows)=>{
        for(row of rows){
        res.status(200).render('agregar_carrito', { arreglo:JSON.parse(JSON.stringify(row)), listExists: true })
    }
    })
    .catch(()=>{
        return res.status(400).json({ "error": "Producto no encontrado" })
    })
    .finally(()=>{
      //knex.destroy()
    })  
});


//------------------------------Guardar Producto---------------------------------------


router.post(`/productos/`, function (req, res) {
    if(admin){
    knex('productos').insert({Nombre:req.body.nombre,descripcion:req.body.des,codigo:req.body.cod,url:req.body.url,precio:req.body.precio,stock:req.body.stock})
    .then (()=>console.log('data inserted'))
    .catch((err)=>{console.log(err); throw err})
    .finally(()=>{
      //knex.destroy();
      res.status(200).redirect(`/productos/agregar`);
    })
    } 
    if(!admin){
        res.status(400).json( { error : -1, descripcion: 'ruta /productos/ método post no autorizada'})
    }
});
//------------------------------Actualizar Producto---------------------------------------
router.put(`/productos/:id`, function (req, res) {
    let id =parseInt(req.params.id)
    if(admin){
    knex.from('productos').where('Id',id).update({Nombre:req.body.nombre,descripcion:req.body.des,codigo:req.body.cod,url:req.body.url,precio:req.body.precio,stock:req.body.stock})
        .then (()=>console.log('producto update'))
        .catch((err)=>{console.log(err); throw err})
        .finally(() => {
          res.status(200).json("actualizado");
          //knex.destroy();
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
            .finally(() => {
              res.status(200).json("Borrado");
              //knex.destroy();
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
        //knex.destroy();    
    })
    })
//-------------------------------Borrar carrito-------------------------------------
router["delete"](`/carrito/:id`, function (req, res) {
    knex.from('carrito').where('Id_carrito',parseInt(req.params.id)).del()
    .then (()=>console.log('producto delete'))
    .catch((err)=>{console.log(err); throw err})
    .finally(()=>{
        res.status(200).json("Borrado")
        //knex.destroy();
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

    knex.from('productos').select('*')
    .then((rows)=>{
        socket.emit('lista',rows);    
    })
    .catch(()=>{
        return res.status(400).json({ "error": "Producto no encontrado" })
    })
    .finally(()=>{
      //knex.destroy()
    }) 

    knex.from('carrito').select('*')
    .then((rows)=>{
        socket.emit('lista_carrito',rows);    
    })
    .catch(()=>{
        return res.status(400).json({ "error": "Producto no encontrado" })
    })
    .finally(()=>{
      //knex.destroy()
    }) 
})
