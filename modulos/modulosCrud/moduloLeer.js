module.exports = {
    leer : async function(fs,tabla) {
            try{
              let contenido = await fs.promises.readFile(tabla,`utf-8`)
               return contenido
            }
            catch{

                console.log([])
                
            }    
       
    }

}