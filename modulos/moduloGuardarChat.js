module.exports = {
    guardar : function(mail,mensaje,fecha,fs) {
        let arrego =[]
        let guardados
        async function leer(){
            
            try{
                await fs.promises.readFile(`./datos/chat.js`,`utf-8`).then(contenido =>{
                guardados =  contenido
                })
             
            }
            catch{
                console.log([])
                
            }
              
    
        }
    
        leer().then(()=>{
            if(guardados) arrego = JSON.parse(guardados)
            let objeto =  {
                mail:mail,
                mensaje: mensaje,
                fecha: fecha
            }
            arrego.push(objeto)
            async function agregar(){
                
                try{
                    await fs.promises.writeFile(`./datos/chat.js`,`${JSON.stringify(arrego, null,'\t') }  \n`)
                    
                }
                catch{
                    console.log('error')
                    
                }
            }
            agregar(this.archivo)
            
        })
    }

}