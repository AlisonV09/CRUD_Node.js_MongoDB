const {MongoClient}= require('mongodb');
require('dotenv').config();
const URI = process.env.URI;

async function Talla(){
    const Client = new MongoClient(URI);

    try{
        await Client.connect();
        const result = await Client.db('SoftDCano').createCollection("Talla",{
            validator:{
                $jsonSchema:{
                    bsonType: 'object',
                    title:'validacionTalla',
                    required:['idTalla','talla'],
                    properties:{
                        idTalla:{
                            bsonType: 'int'
                        },
                        talla:{
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
// Talla();

async function insertarTalla(Talla){

    const Client = new MongoClient(URI)

    try {
        await Client.connect();
        const result = await Client.db("SoftDCano").collection("Talla").insertMany(Talla);
        console.log(`Se creo un nuevo registro: ${result.insertedCount}`);
        console.log(Talla);
    }catch(e){
        console.log(e);
    }finally{
        await Client.close();
    }
}

const registrosTalla = [
    {
        idTalla: 001,
        talla: "S"
    },
    {
        idTalla: 002,
        talla: "L"
    },
    {
        idTalla: 003,
        talla: "M"
    },
    {
        idTalla: 004,
        talla: "XL"
    }
  ];
  
// insertarTalla(registrosTalla);