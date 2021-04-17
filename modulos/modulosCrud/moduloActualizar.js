module.exports = {
    actualizar : function(timestamp,nombre,des,cod,url,precio,stock,id,fs,tabla) {
        let arreglo =[]
        let guardados
        async function leer(){
            
            try{
                await fs.promises.readFile(tabla,`utf-8`).then(contenido =>{
                   guardados =  contenido
                })
            }
            catch{
                console.log([])
                
            }
              
    
        }
    
        leer().then(()=>{
            if(guardados) arreglo = JSON.parse(guardados)
            arreglo.forEach((element,index) =>{
                if (element.id == id){
                 
                    let objeto =  {
                        id : element.id,
                        timestamp:timestamp,
                        nombre: nombre,
                        des:des,
                        cod:cod,
                        url: url,
                        precio: precio,
                        stock:stock   
                    }
                  arreglo.splice(index,1,objeto)    
                }

            })
        
            async function agregar(){
                
                try{
                    await fs.promises.writeFile(tabla,`${JSON.stringify(arreglo, null,'\t') }\n`)
                }
                catch{
                    console.log('error')
                    
                }
            }
            agregar()
            
        })
    }

}