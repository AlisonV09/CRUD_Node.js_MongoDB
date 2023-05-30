const { MongoClient } = require('mongodb');
const { faker } = require('@faker-js/faker');
require('dotenv').config();
const URI = process.env.URI;

async function DatosComprador() {
    const Client = new MongoClient(URI);

    try {
        await Client.connect();
        const result = await Client.db('SoftDCano').createCollection("DatosComprador", {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    title: 'validacionDatosComprador',
                    required: ['dni', 'nombreComprador', 'apellidoComprador', 'celularComprador', 'direccionComprador'],
                    properties: {
                        dni: {
                            bsonType: 'int'
                        },
                        nombreComprador: {
                            bsonType: 'string'
                        },
                        apellidoComprador: {
                            bsonType: "string"
                        },
                        celularComprador: {
                            bsonType: "string"
                        },
                        direccionComprador: {
                            bsonType: "string"
                        },
                        emailComprador: {
                            bsonType: "string"
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
// DatosComprador();

async function PoblarDatosComprador(RegistrosComprador) {

    const Client = new MongoClient(URI)

    try {
        await Client.connect();
        const Datos = [];
        for (let i = 0; i < RegistrosComprador; i++) {
            let nombreComprador = faker.person.firstName(),
                apellidoComprador = faker.person.lastName();
            const DatosInsertar = {

                dni: faker.number.int({ min: 100000000, max: 999999999 }),
                nombreComprador: nombreComprador,
                apellidoComprador: apellidoComprador,
                celularComprador: faker.phone.number('+57 ##########'),
                direccionComprador: faker.location.streetAddress(),
                emailComprador: faker.internet.email({ firstName: nombreComprador, lastName: apellidoComprador }),
            }
            Datos.push(DatosInsertar);
            console.log(`Se han insertado: ${Datos.length} datos`)
        }
        const Result = await Client.db('SoftDCano').collection('DatosComprador').insertMany(Datos)
        if (result.insertedCount > 0) {
            console.log(`Se han insertado ${result.insertedCount} documentos correctamente`);
        } else {
            console.log("No se han insertado documentos");
        }

    } catch (e) {
        console.log(e);
    } finally {
        await Client.close();
    }
}
// PoblarDatosComprador(2000);

//Funciones Crud

//Buscar

async function FindOneDatosComprador(nombreComprador) {
    const Client = new MongoClient(URI);

    try {
        await Client.connect();
        const result = await Client.db("SoftDCano").collection("DatosComprador").findOne({ nombreComprador: nombreComprador });
        if (result) {
            console.log(`Se encontro un Registro: ${nombreComprador}`);
            console.log(result);
        } else {
            console.log(`No se encontro un Registro: ${nombreComprador}`);
        }
    } catch (e) {
        console.log(e);
    } finally {
        await Client.close();
    }
}
// FindOneDatosComprador("Noah");

async function FindDatosComprador(apeComprador) {
    const Client = new MongoClient(URI);

    try {
        await Client.connect();
        const result = await Client.db("SoftDCano").collection("DatosComprador").find({apellidoComprador: apeComprador }).project({ nombreComprador: true, apellidoComprador: true, celularComprador: true, direccionComprador: true, emailComprador: true }).sort({ nombreComprador: 1 }).limit(10).toArray();
        if (result.length > 0) {
            console.log(`Se encontro un Registro: ${apeComprador}`);
            console.log(result);
        } else {
            console.log(`No se encontro un Registro: ${apeComprador}`);
        }
    } catch (e) {
        console.log(e);
    } finally {
        await Client.close();
    }
}

// FindDatosComprador("Hills");

//Crear

async function insertOneDatosComprador(nuevoDatosComprador) {
    const Client = new MongoClient(URI);

    try {
        await Client.connect();
        const result = await Client.db("SoftDCano").collection("DatosComprador").insertOne(nuevoDatosComprador);
        console.log(`Se creo un nuevo Registro con el siguiente id: ${result.insertedId}`);
        console.log(nuevoDatosComprador);
    } catch (e) {
        console.log(e);
    } finally {
        Client.close();
    }
}

// insertOneDatosComprador({
//     dni: 278475894,
//     nombreComprador: 'Alison',
//     apellidoComprador: 'Valle',
//     celularComprador: '+57 3015083696',
//     direccionComprador: '310 Fay Roads',
//     emailComprador: 'valle_alison88@gmail.com', 
// });

async function insertManyDatosComprador(nuevosDatosComprador) {
    const Client = new MongoClient(URI);

    try {
        await Client.connect();
        const result = await Client.db("SoftDCano").collection("DatosComprador").insertMany(nuevosDatosComprador);
        console.log(`Se creo ${result.insertedCount} nuevos Registros`);
        console.log(nuevosDatosComprador);
    } catch (e) {
        console.log(e);
    } finally {
        Client.close();
    }
}

const nuevosDatosComprador = [
    {
        dni: 973790123,
        nombreComprador: 'Esteban',
        apellidoComprador: 'Valle',
        celularComprador: '+57 3215083696',
        direccionComprador: '999 Fay Roads',
        emailComprador: 'ValleE_88@gmail.com',
    },
    {
        dni: 474671253,
        nombreComprador: 'Hugo',
        apellidoComprador: 'Valle',
        celularComprador: '+57 3015083463',
        direccionComprador: '089 Fay Roads',
        emailComprador: 'ValleH_88@gmail.com',
    },
    {
        dni: 846273567,
        nombreComprador: 'German',
        apellidoComprador: 'Valle',
        celularComprador: '+57 3047883696',
        direccionComprador: '469 Fay Roads',
        emailComprador: 'ValleG_88@gmail.com',
    }
];

// insertManyDatosComprador(nuevosDatosComprador);

//Update

async function updateOneDatosComprador(dni, atributoCambio) {
    const Client = new MongoClient(URI);

    try {
        await Client.connect();
        const result = await Client.db("SoftDCano").collection("DatosComprador").updateOne
            ({ dni: dni }, { $set: { celularComprador: atributoCambio } });
        console.log(`${result.matchedCount} el Registro cumple con el criterio de busqueda`);
        console.log(`${result.modifiedCount} el Registro fue actualizado`);
    } catch (e) {
        console.log(e);
    } finally {
        Client.close();
    }
}

// updateOneDatosComprador(243330918, "+57 0384236562");

async function updateManyDatosComprador(celularComprador, atributoCambio) {
    const Client = new MongoClient(URI);

    try {
        await Client.connect();
        const result = await Client.db("SoftDCano").collection("DatosComprador").updateMany
            ({ celularComprador: celularComprador }, { $set: { direccionComprador: atributoCambio } });
        console.log(`${result.matchedCount} el Registro cumple con el criterio de busqueda`);
        console.log(`${result.modifiedCount} el Registro fue actualizado`);
    } catch (e) {
        console.log(e);
    } finally {
        Client.close();
    }
}

// updateManyDatosComprador("+57 0384236562", "088 Fay Roads");

//Eliminar
async function deleteOneDatosComprador(eliminarDatosComprador) {
    const Client = new MongoClient(URI);

    try {
        await Client.connect();
        const result = await Client.db("SoftDCano").collection("DatosComprador").deleteOne(eliminarDatosComprador);
        console.log(`${result.deletedCount} Registro eliminado`);
    } catch (e) {
        console.log(e);
    } finally {
        Client.close();
    }
}

// deleteOneDatosComprador({dni: 846273567});

async function deleteManyDatosComprador(eliminarDatosComprador) {
    const Client = new MongoClient(URI);

    try {
        await Client.connect();
        const result = await Client.db("SoftDCano").collection("DatosComprador").deleteOne(eliminarDatosComprador);
        console.log(`${result.deletedCount} Registros eliminados`);
    } catch (e) {
        console.log(e);
    } finally {
        Client.close();
    }
}

// deleteManyDatosComprador({celularComprador: "+57 3015083463"});

async function dropCollectionComprador(EliminarColeccion) {
    const Client = new MongoClient(URI);

    try {
        await Client.connect();
        const result = await Client.db("SoftDCano").collection(EliminarColeccion).drop();
        console.log(`La colección ${E} ha sido eliminada`);
    } catch (e) {
        console.log(e);
    } finally {
        Client.close();
    }
}

// dropCollectionComprador("DatosComprador");

async function dropDatabase(eliminarBasedeDatos) {
    const Client = new MongoClient(URI);

    try {
        await Client.connect();
        const result = await Client.db(eliminarBasedeDatos).dropDatabase();
        console.log(`La base de datos ${eliminarBasedeDatos} ha sido eliminada`);
    } catch (e) {
        console.log(e);
    } finally {
        Client.close();
    }
}

// dropDatabase("SoftDCano");

async function aggregateDatosComprador() {
    const Client = new MongoClient(URI);

    try {
        await Client.connect();
        const result = await Client.db("SoftDCano").collection("DatosComprador").aggregate([
            {
                $sort: {
                    dni: -1,
                }
            }, {
                $limit: 6,
            }, {
                $project: {
                    dni: true,
                    nombreComprador: true,
                    apellidoComprador: true,
                    celularComprador: true,
                    direccionComprador: true
                }
            }
        ]).toArray();
        console.log("Consulta exitosa");
    } catch (e) {
        console.log(e);
    } finally {
        await Client.close();
    }
}

// aggregateDatosComprador();

async function aggregateDatosCompradordos() {
    const Client = new MongoClient(URI);

    try {
        await Client.connect();
        const result = await Client.db("SoftDCano").collection("DatosComprador").aggregate([
            {
                $unwind: "$emailComprador",
            }, {
                $sort: {
                    celularComprador: 1,
                }
            }, {
                $project: {
                    dni: true,
                    nombreComprador: true,
                    apellidoComprador: true,
                    celularComprador: true,
                    emailComprador: true
                }
            }
        ]).toArray();
        console.log("Consulta exitosa");
    } catch (e) {
        console.log(e);
    } finally {
        await Client.close();
    }
}
// aggregateDatosCompradordos();  