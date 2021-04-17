const socket = io(); 

socket.on('lista', data => {
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

      <th scope="row">${el.Id} </th>
      <td>${el.Nombre} </td>
      <td>${el.timestamp}<input  type="hidden" class="form-control" id="id"  value=${el.timestamp} name="timestamp" aria-describedby="timestamp"></td>
      <td>${el.descripcion}</td>
      <td>${el.codigo}</td>
      <td>${el.precio}</td>
      <td>${el.stock}</td>
      <td><img src=${el.url} class="img-fluid" alt="Responsive image"></td>
      <td><a href="/carrito/agregar/${el.id}" class="btn btn-primary">Agregar a carrito</a></td>
      <td><a href="/productos/listar/${el.id}" class="btn btn-primary">Editar</a></td>
      </form>
    </tr>`    
   })
   texto +=`  </tbody>
   </table>
   </div>` 
   document.getElementById(`lista_todos_productos`).innerHTML = texto
  
})

