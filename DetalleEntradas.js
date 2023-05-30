const { MongoClient } = require('mongodb');
const { faker } = require('@faker-js/faker');
require('dotenv').config();
const URI = process.env.URI;

async function DetalleEntradas() {
  const Client = new MongoClient(URI);
  
  try {
    await Client.connect();
    const result = await Client.db('SoftDCano').createCollection("DetalleEntradas", {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          title: 'validacionUsuario',
          required: ['idDetalleEntrada', 'idEntrada', 'idProducto', 'cantidadEntrada'],
          properties: {
            idDetalleEntrada: {
              bsonType: 'int'
            },
            idEntrada: {
              bsonType: 'int'
            },
            idProducto: {
              bsonType: 'int'
            },
            cantidadEntrada: {
              bsonType: "int"
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
// DetalleEntradas();

async function PoblateCollection(NumeroRegistros) {

  const Client = new MongoClient(URI)

  try {
    await Client.connect();
    const DetalleEntradas = await Client.db("SoftDCano").collection("DetalleEntradas").find({}).toArray();
    const Entradas = await Client.db("SoftDCano").collection("Entradas").find({}).project({ idEntrada: true, _id: false }).toArray();
    const Productos = await Client.db("SoftDCano").collection("Productos").find({}).project({ idProducto: true, _id: false }).toArray();
    const Datos = [];
    for (let i = 0; i < NumeroRegistros; i++) {
      const DatosInsertar = {

        idDetalleEntrada: DetalleEntradas.length + i,
        idEntrada: faker.helpers.arrayElement(Entradas).idEntrada,
        idProducto: faker.helpers.arrayElement(Productos).idProducto,
        cantidadEntrada: faker.number.int({ min: 00001, max: 99999 }),


      }
      Datos.push(DatosInsertar);
      console.log(`Se han insertado: ${Datos.length} datos`)
    }
    const Result = await Client.db('SoftDCano').collection('DetalleEntradas').insertMany(Datos)

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
    const datoinsertar = {
      idDetalleEntrada: 1234567890,
      idEntrada: 098765,
      idProducto: 98675423,
      cantidadEntrada: 12,
    };
    const result = await Client.db('SoftDCano').collection('DetalleEntradas').insertOne(datoinsertar);
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
    const DetalleEntradas = await Client.db("SoftDCano").collection("DetalleEntradas").find({}).toArray();
    const Entradas = await Client.db("SoftDCano").collection("Entradas").find({}).project({ idEntrada: true, _id: false }).toArray();
    const Productos = await Client.db("SoftDCano").collection("Productos").find({}).project({ idProducto: true, _id: false }).toArray();
    const Datos = [];

    for (let i = 0; i < 9; i++) {
      const DatosInsertar = {
        idDetalleEntrada: DetalleEntradas.length + i,
        idEntrada: faker.helpers.arrayElement(Entradas).idEntrada,
        idProducto: faker.helpers.arrayElement(Productos).idProducto,
        cantidadEntrada: faker.number.int({ min: 1, max: 9999999 }),
      };

      Datos.push(DatosInsertar);
      console.log(`Se han insertado: ${Datos.length} datos`);
    }
    const result = await Client.db('SoftDCano').collection('DetalleEntradas').insertMany(DatosInsertar);
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

    const result = await Client.db('SoftDCano').collection('DetalleEntradas').updateOne(filtroactualizar, update);
    console.log(`${result.modifiedCount} documento(s) actualizado(s)`);
  } catch (error) {
    console.error(error);
  } finally {
    await Client.close();
  }
}
const filtroactualizar = { idDetalleEntrada: 1 }; // Filtro para encontrar el documento a actualizar
const update = { $set: { cantidadCompra: 23 } }; // Actualización a aplicar

// updateOneDocument("DetalleEntradas", filtroactualizar, update);

// Función para actualizar varios documentos en una colección
async function updateManyDocuments(filterEn, updateE) {
  const Client = new MongoClient(URI);
  try {
    await Client.connect();

    const result = await Client.db('SoftDCano').collection('DetalleEntradas').updateMany(filterEn, updateE);
    console.log(`${result.modifiedCount} documento(s) actualizado(s)`);
  } catch (error) {
    console.error(error);
  } finally {
    await Client.close();
  }
}

// Ejemplo de uso:
const filterEn = { idDetalleEntrada: { $gte: 100 } }; // Filtro para encontrar los documentos a actualizar
const updateE = { $set: { cantidadCompra: 10 } }; // Actualización a aplicar

// updateManyDocuments("DetalleEntradas", filterEn, updateE);

// Función para buscar un solo documento en una colección
async function findDocuments(query) {
  const Client = new MongoClient(URI);
  try {
    await Client.connect();

    const result = await Client.db('SoftDCano').collection('DetalleEntradas').find(query).toArray();
    console.log(result);
  } catch (error) {
    console.error(error);
  } finally {
    await Client.close();
  }
}

const query = {
  idDetalleEntrada: 123 //documento a buscar
};

// findDocuments("DetalleEntradas", query);

// Función para buscar documentos en una colección
async function findDocuments() {
  const Client = new MongoClient(URI);
  try {
    await Client.connect();

    const result = await Client.db('SoftDCano').collection('DetalleEntradas').find().toArray();
    console.log(result);
  } catch (error) {
    console.error(error);
  } finally {
    await Client.close();
  }
}

// findDocuments("DetalleEntradas");

// Función para eliminar un documento de una colección
async function deleteOneDocument(filter) {
  const Client = new MongoClient(URI);
  try {
    await Client.connect();

    const result = await Client.db('SoftDCano').collection('DetalleEntradas').deleteOne(filter);
    console.log(`${result.deletedCount} documento(s) eliminado(s)`);
  } catch (error) {
    console.error(error);
  } finally {
    await Client.close();
  }
}
const filter = { idDetalleEntrada: 1 }; // Filtro para encontrar el documento a eliminar

// deleteOneDocument("DetalleEntradas", filter);

// Función para eliminar varios documentos de una colección
async function deleteManyDocuments() {
  const Client = new MongoClient(URI);
  try {
    await Client.connect();

    const result = await Client.db('SoftDCano').collection('DetalleEntradas').deleteMany(filterE);
    console.log(`${result.deletedCount} documento(s) eliminado(s)`);
  } catch (error) {
    console.error(error);
  } finally {
    await Client.close();
  }
}
const DetalleEntradas = 'DetalleEntradas';
const filterE = { cantidadEntrada: 12000 };

// deleteManyDocuments(DetalleEntradas, filterE);

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
const collection = "DetalleEntradas";

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
    const result = await Client.db('SoftDCano').collection('DetalleVentas').find().limit(10).toArray();
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
    const result = await Client.db('SoftDCano').collection('DetalleEntradas').aggregate([
      {
        $lookup: {
          from: 'Entradas',
          localField: 'idEntrada',
          foreignField: 'idEntrada',
          as: 'entrada'
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

// Ejemplo de pipeline con $match, $group y $project
async function ejemploPipeline() {
  const Client = new MongoClient(URI);
  try {
    await Client.connect();
    const result = await Client.db('SoftDCano').collection('DetalleEntrada').aggregate([
      {
        $match: {
          cantidadEntrada: { $gte: 10000 }
        }
      },
      {
        $group: {
          _id: '$idProducto',
          totalCantidad: { $sum: '$cantidadEntrada' },
          totalDocumentos: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          totalCantidad: 1,
          totalDocumentos: 1,
          promedio: { $divide: ['$totalCantidad', '"totalDocumentos'] }
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

// Ejemplo de $sort: Ordenar documentos por un campo específico
async function ejemploUnwind() {
  const Client = new MongoClient(URI);
  try {
    await Client.connect();
    const result = await Client.db('SoftDCano').collection('DetalleEntrada').find().sort({ idDetalleEntrada: -1 }).toArray();
    console.log(result);
  } catch (error) {
    console.error(error);
  } finally {
    await Client.close();
  }
}
// ejemploUnwind();