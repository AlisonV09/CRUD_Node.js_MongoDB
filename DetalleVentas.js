const { MongoClient } = require('mongodb');
const { faker } = require('@faker-js/faker');
require('dotenv').config();
const URI = process.env.URI;

//Se crea la colección DetalleVentas
async function DetalleVentas() {
  const Client = new MongoClient(URI);

  try {
    await Client.connect();
    const result = await Client.db('SoftDCano').createCollection("DetalleVentas", {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          title: 'validacionDetalleVentas',
          required: ['idDetalleVenta', 'idVenta', 'idProducto', 'cantidadCompra', 'subtotalVenta'],
          properties: {
            idDetalleVenta: {
              bsonType: 'int'
            },
            idVenta: {
              bsonType: 'int'
            },
            idProducto: {
              bsonType: 'int'
            },
            cantidadCompra: {
              bsonType: 'int'
            },
            subtotalVenta: {
              bsonType: 'int'
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
// DetalleVentas();

//Poblamos la colección
async function PoblateDetalleVentas(NumeroRegistros) {
  const Client = new MongoClient(URI);

  try {
    await Client.connect();
    const DetalleVentas = await Client.db("SoftDCano").collection("DetalleVentas").find({}).toArray();
    const Ventas = await Client.db("SoftDCano").collection("Ventas").find({}).project({ idVenta: true, _id: false }).toArray();
    const Productos = await Client.db("SoftDCano").collection("Productos").find({}).project({ idProducto: true, _id: false }).toArray();
    const Datos = [];

    for (let i = 0; i < NumeroRegistros; i++) {
      const DatosInsertar = {
        idDetalleVenta: DetalleVentas.length + i,
        idVenta: faker.helpers.arrayElement(Ventas).idVenta,
        idProducto: faker.helpers.arrayElement(Productos).idProducto,
        cantidadCompra: faker.number.int({ min: 1, max: 100 }),
        subtotalVenta: faker.number.int({ min: 10000, max: 1000000 })
      };

      Datos.push(DatosInsertar);
      console.log(`Se han insertado: ${Datos.length} datos`);
    }

    const Result = await Client.db('SoftDCano').collection('DetalleVentas').insertMany(Datos);
    console.log(`Total de documentos insertados en 'DetalleVentas': ${Result.insertedCount}`);
  } catch (e) {
    console.log(e);
  } finally {
    await Client.close();
  }
}
// PoblateDetalleVentas(2000);

// Función para insertar un documento en una colección
async function insertOneDocument(DetalleVentas, document) {
  const client = new MongoClient(URI);
  try {
    await client.connect();

    // Obtener el próximo valor para idDetalleVenta
    const lastDocument = await client.db('SoftDCano').collection(DetalleVentas).find().sort({ idDetalleVenta: -1 }).limit(1).toArray();
    const nextIdDetalleVenta = lastDocument.length > 0 ? lastDocument[0].idDetalleVenta + 1 : 1;
    document.idDetalleVenta = nextIdDetalleVenta;

    // Consultar los datos relacionados para idVenta
    const venta = await client.db('SoftDCano').collection("Ventas").findOne({ idVenta: document.idVenta });
    document.venta = venta; // Asignar los datos relacionados a un campo del documento

    // Consultar los datos relacionados para idProducto
    const producto = await client.db('SoftDCano').collection("Productos").findOne({ idProducto: document.idProducto });
    document.producto = producto; // Asignar los datos relacionados a un campo del documento

    const result = await client.db('SoftDCano').collection(DetalleVentas).insertOne(document);
    console.log(`Documento insertado con ID: ${result.insertedId}`);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

const document = {
  idVenta: 123, // Reemplaza con el valor adecuado
  idProducto: 456, // Reemplaza con el valor adecuado
  cantidadCompra: 10, // Reemplaza con el valor adecuado
  subtotalVenta: 100 // Reemplaza con el valor adecuado
};
// insertOneDocument("DetalleVentas", document);

// Función para insertar varios documentos en una colección
async function insertManyDocuments(DetalleVentas, documents) {
  const client = new MongoClient(URI);
  try {
    await client.connect();

    const lastDocument = await client.db('SoftDCano').collection(DetalleVentas).find().sort({ idDetalleVenta: -1 }).limit(1).toArray();
    const nextIdDetalleVenta = lastDocument.length > 0 ? lastDocument[0].idDetalleVenta + 1 : 1;

    for (let i = 0; i < documents.length; i++) {
      const document = documents[i];
      document.idDetalleVenta = nextIdDetalleVenta + i;

      const venta = await client.db('SoftDCano').collection("Ventas").findOne({ idVenta: document.idVenta });
      document.venta = venta;

      const producto = await client.db('SoftDCano').collection("Productos").findOne({ idProducto: document.idProducto });
      document.producto = producto;
    }

    const result = await client.db('SoftDCano').collection(DetalleVentas).insertMany(documents);
    console.log(`Total de documentos insertados: ${result.insertedCount}`);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

const documents = [
  {
    idVenta: 123,
    idProducto: 456,
    cantidadCompra: 10,
    subtotalVenta: 100
  },
  {
    idVenta: 456,
    idProducto: 789,
    cantidadCompra: 5,
    subtotalVenta: 50
  }
];
// insertManyDocuments("DetalleVentas", documents);

// Función para buscar un solo documento en una colección
async function findDocuments(DetalleVentas, query) {
  const client = new MongoClient(URI);
  try {
    await client.connect();

    const result = await client.db('SoftDCano').collection(DetalleVentas).find(query).toArray();
    console.log(result);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

const query = {
  idDetalleVenta: 123 //documento a buscar
};

// findDocuments("DetalleVentas", query);

// Función para buscar documentos en una colección
async function findDocuments(DetalleVentas) {
  const client = new MongoClient(URI);
  try {
    await client.connect();

    const result = await client.db('SoftDCano').collection(DetalleVentas).find().toArray();
    console.log(result);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}
// findDocuments("DetalleVentas");

// Función para actualizar un documento en una colección
async function updateOneDocument(DetalleVentas, filterAc, updateAc) {
  const client = new MongoClient(URI);
  try {
    await client.connect();

    const result = await client.db('SoftDCano').collection(DetalleVentas).updateOne(filterAc, updateAc);
    console.log(`${result.modifiedCount} documento(s) actualizado(s)`);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}
const filterAc = { idDetalleVenta: 1 }; // Filtro para encontrar el documento a actualizar
const updateAc = { $set: { cantidadCompra: 10 } }; // Actualización a aplicar
// updateOneDocument("DetalleVentas", filterAc, updateAc);

// Función para actualizar varios documentos en una colección
async function updateManyDocuments(DetalleVentas, filterAv, updateAv) {
  const client = new MongoClient(URI);
  try {
    await client.connect();

    const result = await client.db('SoftDCano').collection(DetalleVentas).updateMany(filterAv, updateAv);
    console.log(`${result.modifiedCount} documento(s) actualizado(s)`);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}
const filterAv = { idDetalleVenta: { $gte: 100 } }; // Filtro para encontrar los documentos a actualizar
const updateAv = { $set: { cantidadCompra: 10 } }; // Actualización a aplicar
// updateManyDocuments("DetalleVentas", filterAv, updateAv);

// Función para eliminar un documento de una colección
async function deleteOneDocument(DetalleVentas, filter) {
  const client = new MongoClient(URI);
  try {
    await client.connect();

    const result = await client.db('SoftDCano').collection(DetalleVentas).deleteOne(filter);
    console.log(`${result.deletedCount} documento(s) eliminado(s)`);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}
const filter = { idDetalleVenta: 1 }; // Filtro para encontrar el documento a eliminar
// deleteOneDocument("DetalleVentas", filter);

// Función para eliminar varios documentos de una colección
async function deleteManyDocuments(DetalleVentas, filterV) {
  const client = new MongoClient(URI);
  try {
    await client.connect();

    const result = await client.db().collection(DetalleVentas).deleteMany(filterV);
    console.log(`${result.deletedCount} documento(s) eliminado(s)`);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}
const DetalleVentas = "DetalleVentas";
const filterV = { /* Agrega tu filtro aquí */ };
// deleteManyDocuments(DetalleVentas, filterV);

// Función para eliminar una colección
async function dropCollection(DetalleVentas) {
  const client = new MongoClient(URI);
  try {
    await client.connect();
    const result = await client.db('SoftDCano').dropCollection(DetalleVentas);
    console.log(`Colección '${DetalleVentas}' eliminada`);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}
const collection = "DetalleVentas";
// dropCollection(collection);

// Función para eliminar una base de datos completa
async function dropDatabase() {
  const client = new MongoClient(URI);
  try {
    await client.connect();
    const result = await client.db('SoftDCano').dropDatabase();
    console.log(`Base de datos '${'SoftDCano'}' eliminada`);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}
const database = "SoftDCano";
// dropDatabase(database);

//Función ejemplo de Limit para mostrar los 10 primeros registros
async function ejemploLimit() {
  const client = new MongoClient(URI);
  try {
    await client.connect();
    const result = await client.db('SoftDCano').collection('DetalleVentas').find().limit(10).toArray();
    console.log(result);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}
// ejemploLimit();

// Ejemplo de $lookup: Unir documentos de dos colecciones
async function ejemploLookup() {
  const client = new MongoClient(URI);
  try {
    await client.connect();
    const result = await client.db('SoftDCano').collection('DetalleVentas').aggregate([
      {
        $lookup: {
          from: 'Ventas',
          localField: 'idVenta',
          foreignField: 'idVenta',
          as: 'venta'
        }
      }
    ]).toArray();
    console.log(result);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}
// ejemploLookup();

// Ejemplo de pipeline con $match, $group y $project
async function ejemploPipeline() {
  const client = new MongoClient(URI);
  try {
    await client.connect();
    const result = await client.db('SoftDCano').collection('DetalleVenta').aggregate([
      {
        $match: {
          subtotalVenta: { $gte: 50000 }
        }
      },
      {
        $group: {
          _id: '$idProducto',
          totalCantidad: { $sum: '$cantidadCompra' },
          totalSubtotal: { $sum: '$subtotalVenta' }
        }
      },
      {
        $project: {
          _id: 0,
          idProducto: '$_id',
          totalCantidad: 1,
          totalSubtotal: 1
        }
      }
    ]).toArray();
    console.log(result);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}
// ejemploPipeline();

// Ejemplo de $sort: Ordenar documentos por un campo específico
async function ejemploSort() {
  const client = new MongoClient(URI);
  try {
    await client.connect();
    const result = await client
      .db('SoftDCano')
      .collection('DetalleVentas')
      .find()
      .sort({ subtotalVenta: 1 }) // Orden ascendente por el campo "subtotalVenta"
      .toArray();
    console.log(result);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}
// ejemploSort();

// Ejemplo de $unwind: Desconstruir un campo de array en documentos separados
async function ejemploUnwind() {
  const client = new MongoClient(URI);
  try {
    await client.connect();
    const result = await client
      .db('SoftDCano')
      .collection('DetalleVentas')
      .aggregate([
        {
          $unwind: '$cantidadCompra'
        }
      ])
      .toArray();
    console.log(result);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}
// ejemploUnwind();