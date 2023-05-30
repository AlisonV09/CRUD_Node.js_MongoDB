const {MongoClient}= require('mongodb');
require('dotenv').config();
const URI = process.env.URI;

async function Categoria(){
    const Client = new MongoClient(URI);

    try{
        await Client.connect();
        const result = await Client.db('SoftDCano').createCollection("Categoria",{
            validator:{
                $jsonSchema:{
                    bsonType: 'object',
                    title:'validacionCategoria',
                    required:['idCategoria','nombreCategoria'],
                    properties:{
                        idCategoria:{
                            bsonType: 'int'
                        },
                        nombreCategoria:{
                            bsonType: 'string'
                        }
                    }
                }
            }
        })
        if (result){
            console.log("Base de datos creada correctamente");
        }else{
            console.log("No se ha creado la base de datos");
        }
    }catch(e){
        console.log(e);
    }finally{
        await Client.close();
    }
}
// Categoria();

async function insertarCategoria(Categoria){

    const Client = new MongoClient(URI)

    try {
        await Client.connect();
        const result = await Client.db("SoftDCano").collection("Categoria").insertMany(Categoria);
        console.log(`Se creo un nuevo registro: ${result.insertedCount}`);
        console.log(Categoria);
    }catch(e){
        console.log(e);
    }finally{
        await Client.close();
    }
}

const registrosCategoria = [
    {
        idCategoria: 1,
        nombreCategoria: "Buzos"
    },
    {
        idCategoria: 2,
        nombreCategoria: "Ropa Interior"
    },
    {
        idCategoria: 3,
        nombreCategoria: "Blusas Dama"
    },
    {
        idCategoria: 4,
        nombreCategoria: "Vestidos de Baños"
    },
    {
        idCategoria: 5,
        nombreCategoria: "Short Deportivos"
    },
    {
        idCategoria: 6,
        nombreCategoria: "Pantaloneta unisex"
    },
    {
        idCategoria: 7,
        nombreCategoria: "Duo deportivo subliminado"
    },
    {
        idCategoria: 8,
        nombreCategoria: "Duo deportivo subliminado"
    },
    {
        idCategoria: 9,
        nombreCategoria: "Leggins deportivos"
    },
    {
        idCategoria: 10,
        nombreCategoria: "Falda short deportiva"
    },
    {
        idCategoria: 11,
        nombreCategoria: "Top deportivo"
    }
  ];
// insertarCategoria(registrosCategoria);