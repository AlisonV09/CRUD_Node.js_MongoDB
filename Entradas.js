const { MongoClient } = require('mongodb');
const { faker } = require('@faker-js/faker');
require('dotenv').config();
const URI = process.env.URI;

async function Entradas() {
  const Client = new MongoClient(URI);

  try {
    await Client.connect();
    const result = await Client.db('SoftDCano').createCollection("Entradas", {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          title: 'validacionUsuario',
          required: ['idEntrada', 'idUsuario', 'fechaEntrada'],
          properties: {
            idEntrada: {
              bsonType: 'int'
            },
            idUsuario: {
              bsonType: 'int'
            },
            fechaEntrada: {
              bsonType: "date"
            }
          }
        }
      }
    })
    if (result) {
      console.log("Base de datos creada correctamente");
    } else {
      console.log("No se ha creado la base de datos");
    }
  } catch (e) {
    console.log(e);
  } finally {
    await Client.close();
  }
}
// Entradas();

async function PoblateCollection(NumeroRegistros) {

  const Client = new MongoClient(URI)

  try {
    await Client.connect();
    const Entradas = await Client.db("SoftDCano").collection("Entradas").find({}).toArray();
    const Usuarios = await Client.db("SoftDCano").collection("Usuario").find({}).project({ idUsuario: true, _id: false }).toArray();
    const Datos = [];
    for (let i = 0; i < NumeroRegistros; i++) {
      var fechaEntrada = faker.date.recent();
      const DatosInsertar = {

        idEntrada: Entradas.length + i,
        idUsuario: faker.helpers.arrayElement(Usuarios).idUsuario,
        fechaEntrada: fechaEntrada,


      }
      Datos.push(DatosInsertar);
      console.log(`Se han insertado: ${Datos.length} datos`)
    }
    const Result = await Client.db('SoftDCano').collection('Entradas').insertMany(Datos)

  } catch (e) {
    console.log(e);
  } finally {
    await Client.close();
  }


}
// PoblateCollection(2000);

// Función para insertar un documento en una colección

async function insertOneDocument() {
  const Client = new MongoClient(URI);
  try {
    await Client.connect();
    var fechaEntrada = faker.date.recent();
    const datoinsertar = {
      idEntrada: 1234567890,
      idUsuario: 098765,
      fechaEntrada: fechaEntrada
    };
    const result = await Client.db('SoftDCano').collection('Entradas').insertOne(datoinsertar);
    console.log(`Documento insertado con ID: ${result.insertedId}`);
  } catch (error) {
    console.error(error);
  } finally {
    await Client.close();
  }
}
// insertOneDocument();

// Función para insertar varios documentos en una colección
async function insertManyDocuments() {
  const Client = new MongoClient(URI);
  try {
    await Client.connect();
    const Entradas = await Client.db("SoftDCano").collection("Entradas").find({}).toArray();
    const Usuarios = await Client.db("SoftDCano").collection("Usuario").find({}).project({ idUsuario: true, _id: false }).toArray();
    const Datos = [];

    for (let i = 0; i < 9; i++) {
      var fechaEntrada = faker.date.recent();
      const DatosInsertar = {

        idEntrada: Entradas.length + i,
        idUsuario: faker.helpers.arrayElement(Usuarios).idUsuario,
        fechaEntrada: fechaEntrada,


      }
      Datos.push(DatosInsertar);
      console.log(`Se han insertado: ${Datos.length} datos`)
    }
    const result = await Client.db('SoftDCano').collection('Entradas').insertMany(DatosInsertar);
    console.log(`${result.insertedCount} documentos insertados`);
  } catch (error) {
    console.error(error);
  } finally {
    await Client.close();
  }
}
// insertManyDocuments(); 

// Función para actualizar un documento en una colección
async function updateOneDocument(filtroactualizar, update) {
  const Client = new MongoClient(URI);
  try {
    await Client.connect();

    const result = await Client.db('SoftDCano').collection('Entradas').updateOne(filtroactualizar, update);
    console.log(`${result.modifiedCount} documento(s) actualizado(s)`);
  } catch (error) {
    console.error(error);
  } finally {
    await Client.close();
  }
}
const filtroactualizar = { idEntrada: 1 }; // Filtro para encontrar el documento a actualizar
const update = { $set: { idUsuario: 23 } }; // Actualización a aplicar

// updateOneDocument("Entradas", filtroactualizar, update);

// Función para actualizar varios documentos en una colección
async function updateManyDocuments(filterEn, updateE) {
  const Client = new MongoClient(URI);
  try {
    await Client.connect();

    const result = await Client.db('SoftDCano').collection('Entradas').updateMany(filterEn, updateE);
    console.log(`${result.modifiedCount} documento(s) actualizado(s)`);
  } catch (error) {
    console.error(error);
  } finally {
    await Client.close();
  }
}

// Ejemplo de uso:
const filterEn = { idEntrada: { $gte: 100 } }; // Filtro para encontrar los documentos a actualizar
const updateE = { $set: { idUsuario: 10 } }; // Actualización a aplicar

// updateManyDocuments("Entradas", filterEn, updateE);

// Función para buscar un solo documento en una colección
async function findDocuments(query) {
  const Client = new MongoClient(URI);
  try {
    await Client.connect();

    const result = await Client.db('SoftDCano').collection('Entradas').find(query).toArray();
    console.log(result);
  } catch (error) {
    console.error(error);
  } finally {
    await Client.close();
  }
}

const query = {
  idEntrada: 123 //documento a buscar
};

// findDocuments("Entradas", query);

// Función para buscar documentos en una colección
async function findDocuments() {
  const Client = new MongoClient(URI);
  try {
    await Client.connect();

    const result = await Client.db('SoftDCano').collection('Entradas').find().toArray();
    console.log(result);
  } catch (error) {
    console.error(error);
  } finally {
    await Client.close();
  }
}

// findDocuments("Entradas");

// Función para eliminar un documento de una colección
async function deleteOneDocument(filter) {
  const Client = new MongoClient(URI);
  try {
    await Client.connect();

    const result = await Client.db('SoftDCano').collection('Entradas').deleteOne(filter);
    console.log(`${result.deletedCount} documento(s) eliminado(s)`);
  } catch (error) {
    console.error(error);
  } finally {
    await Client.close();
  }
}
const filter = { idEntrada: 1 }; // Filtro para encontrar el documento a eliminar

// deleteOneDocument("Entradas", filter);

// Función para eliminar varios documentos de una colección
async function deleteManyDocuments() {
  const Client = new MongoClient(URI);
  try {
    await Client.connect();

    const result = await Client.db('SoftDCano').collection('Entradas').deleteMany(filterE);
    console.log(`${result.deletedCount} documento(s) eliminado(s)`);
  } catch (error) {
    console.error(error);
  } finally {
    await Client.close();
  }
}
const Entradas = 'Entradas';
const filterE = { idUsuario: 345 };

// deleteManyDocuments(Entradas, filterE);

// Función para eliminar una colección
async function dropCollection(collection) {
  const Client = new MongoClient(URI);
  try {
    await Client.connect();
    const result = await Client.db('SoftDCano').dropCollection(collection);
    console.log(`Colección ${collection} eliminada`);
  } catch (error) {
    console.error(error);
  } finally {
    await Client.close();
  }
}
const collection = "Entradas";

// dropCollection(collection);

// Función para eliminar una base de datos completa
async function dropDatabase() {
  const Client = new MongoClient(URI);
  try {
    await Client.connect();
    const result = await Client.db('SoftDCano').dropDatabase();
    console.log(`Base de datos ${'SoftDCano'} eliminada`);
  } catch (error) {
    console.error(error);
  } finally {
    await Client.close();
  }
}
const database = "SoftDCano";

// dropDatabase(database);

// Ejemplo de $limit: Obtener solo los primeros 10 documentos
async function ejemploLimit() {
  const Client = new MongoClient(URI);
  try {
    await Client.connect();
    const result = await Client.db('SoftDCano').collection('Entradas').find().limit(10).toArray();
    console.log(result);
  } catch (error) {
    console.error(error);
  } finally {
    await Client.close();
  }
}
// ejemploLimit();

// Ejemplo de $lookup: Unir documentos de dos colecciones
async function ejemploLookup() {
  const Client = new MongoClient(URI);
  try {
    await Client.connect();
    const result = await Client.db('SoftDCano').collection('Entradas').aggregate([
      {
        $lookup: {
          from: 'Usuarios',
          localField: 'idUsuario',
          foreignField: 'idUsuario',
          as: 'usuario'
        }
      }
    ]).toArray();
    console.log(result);
  } catch (error) {
    console.error(error);
  } finally {
    await Client.close();
  }
}
// ejemploLookup();

// Ejemplo de $sort: Ordenar documentos por un campo específico
async function ejemploUnwind() {
  const Client = new MongoClient(URI);
  try {
    await Client.connect();
    const result = await Client.db('SoftDCano').collection('Entradas').find().sort({ idEntrada: -1 }).toArray();
    console.log(result);
  } catch (error) {
    console.error(error);
  } finally {
    await Client.close();
  }
}
// ejemploUnwind();

// Ejemplo de pipeline con $match, $limit y $project
async function ejemploPipeline() {
  const Client = new MongoClient(URI);
  try {
    await Client.connect();
    const result = await Client.db('SoftDCano').collection('DetalleEntrada').aggregate([
      {
        $match: {
          idEntrada: { $gte: 800 }
        }
      },
      {
        $limit: 5
      },
      {
        $project: {
          idEntrada: true,
          fechaEntrada: true
        }
      }
    ]).toArray();
    console.log(result);
  } catch (error) {
    console.error(error);
  } finally {
    await Client.close();
  }
}
// ejemploPipeline();