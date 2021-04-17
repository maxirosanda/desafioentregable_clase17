const socket = io(); 

socket.on('lista_carrito', data => {
  let texto =`<div class="col-6">
  <table class="table">
    <thead>
    <tr>
    <th scope="col">Id</th>
    <th scope="col">Nombre</th>
    <th scope="col">timestamp</th>
    <th scope="col">descripcion</th>
    <th scope="col">Codigo</th>
    <th scope="col">Precio</th>
    <th scope="col">Stock</th>
    <th scope="col">Foto</th>
  </tr>
    </thead>
    <tbody>`
  data.forEach((el,index) =>{
    texto += `<tr>

    <th scope="row">${el.id} </th>
    <td>${el.nombre} </td>
    <td>${el.timestamp}<input  type="hidden" class="form-control" id="id"  value=${el.timestamp} name="timestamp" aria-describedby="timestamp"></td>
    <td>${el.des}</td>
    <td>${el.cod}</td>
    <td>${el.precio}</td>
    <td>${el.stock}</td>
    <td><img src=${el.url} class="img-fluid" alt="Responsive image"></td>
    <td><a href="/carrito/${el.id}" class="btn btn-primary">Eliminar</a></td>
    </form>
  </tr>`    
 })
 texto +=`  </tbody>
 </table>
 </div>` 
 document.getElementById(`lista_carrito`).innerHTML = texto

})







