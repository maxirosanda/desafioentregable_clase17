const socket = io(); 
const fecha = new Date();

const enviarMensaje = () =>{
    let paquete = { mail: document.getElementById("mail").value,
     mensaje: document.getElementById("mensaje").value,
     fecha: `${fecha.getDay()}/${fecha.getMonth()}/${fecha.getFullYear()} ${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()} `
}
    socket.emit('paquete', paquete)
} 
socket.on('vermensajes', data => {
    
    let texto =""
    data.forEach((el,index) =>{
      texto += `<li class="list-group-item"> Mail : ${el.email} mensaje ${el.mensaje} fecha ${el.fecha} </li>`    
   })
   document.getElementById("contenedordatos").innerHTML=texto

})
