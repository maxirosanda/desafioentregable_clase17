module.exports = {
    guardar : function(id,timestamp,nombre,des,cod,url,precio,stock,fs,tabla,cuento) {
        let arrego =[]
        let guardados
        let cont
        let objeto
        async function leer(){
            
            try{
                await fs.promises.readFile(tabla,`utf-8`).then(contenido =>{
                guardados =  contenido
                })
                await fs.promises.readFile(`./datos/cont.js`,`utf-8`).then(contenido =>{
                    cont = parseInt(contenido)
                    })
            }
            catch{
                console.log([])
                
            }
              
    
        }
    
        leer().then(()=>{
            if(guardados) arrego = JSON.parse(guardados)
            if(cuento){
                cont = cont + 1
                 objeto ={
                    id :cont,
                    timestamp:timestamp,
                    nombre: nombre,
                    des:des,
                    cod:cod,
                    url: url,
                    precio: precio,
                    stock:stock   
                }   
            }else{
                 objeto ={
                    id :id,
                    timestamp:timestamp,
                    nombre: nombre,
                    des:des,
                    cod:cod,
                    url: url,
                    precio: precio,
                    stock:stock  
            }}
            
            arrego.push(objeto)
            async function agregar(){
                
                try{
                    await fs.promises.writeFile(tabla,`${JSON.stringify(arrego, null,'\t') }  \n`)
                    await fs.promises.writeFile(`./datos/cont.js`,`${cont}  \n`)
                }
                catch{
                    console.log('error')
                    
                }
            }
            agregar(this.archivo)
            
        })
    }

}