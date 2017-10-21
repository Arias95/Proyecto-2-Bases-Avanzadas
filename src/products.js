var express = require("express");
var router = express.Router();
var MongoClient = require('mongodb').MongoClient
var test = require('assert');
var database = require('./database.js');
var bodyParser = require("body-parser");

// ======== BODY PARSER INIT ========
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// ======== MAIN FUNCTIONS ========
function addProduct(product, type) {
    if (type == 'libro') {
        MongoClient.connect(database.main, function (err, db) {
            var collection = db.collection('libro');
            collection.insertOne(product, function (err, r) {
                test.equal(null, err);
                test.equal(1, r.insertedCount);
                db.close();
            });
        });
    } else if (type == 'dvd') {
        MongoClient.connect(database.main, function (err, db) {
            var collection = db.collection('dvd');
            collection.insertOne(product, function (err, r) {
                test.equal(null, err);
                test.equal(1, r.insertedCount);
                db.close();
            });
        });
    } else if (type == 'electrodomestico') {
        MongoClient.connect(database.main, function (err, db) {
            var collection = db.collection('electrodomestico');
            collection.insertOne(product, function (err, r) {
                test.equal(null, err);
                test.equal(1, r.insertedCount);
                db.close();
            });
        });
    }
}

function updateProduct(productID, params, type) {
    if (type == 'libro') {
        MongoClient.connect(database.main, function (err, db) {
            var collection = db.collection('libro');
            collection.updateOne(productID, {
                $set: {
                    "nombre": params.nombre,
                    "descripcion": params.descripcion,
                    "precio": params.precio,
                    "autor": params.autor,
                    "ano": params.ano,
                    "editorial": params.editorial,
                    "numpaginas": params.numpaginas
                }
            });
            db.close();
        });
    } else if (type == 'dvd') {
        MongoClient.connect(database.main, function (err, db) {
            var collection = db.collection('dvd');
            collection.updateOne(productID, {
                $set: {
                    "nombre": params.nombre,
                    "descripcion": params.descripcion,
                    "precio": params.precio
                }
            });
            db.close();
        });
    } else if (type == 'appliance') {
        MongoClient.connect(database.main, function (err, db) {
            var collection = db.collection('electrodomestico');
            collection.updateOne(productID, {
                $set: {
                    "nombre": params.nombre,
                    "descripcion": params.descripcion,
                    "precio": params.precio,
                    "color": params.color,
                    "voltaje": params.voltaje,
                    "marca": params.marca
                }
            });
            db.close();
        });
    }
}

function deleteProduct(productID, type) {
    if (type == 'libro') {
        MongoClient.connect(database.main, function (err, db) {
            var collection = db.collection('libro');
            collection.deleteOne({ "codigo": productID });
            db.close();
        });
    } else if (type == 'dvd') {
        MongoClient.connect(database.main, function (err, db) {
            var collection = db.collection('dvd');
            collection.deleteOne({ "codigo": productID });
            db.close();
        });
    } else if (type == 'appliance') {
        console.log(productID);
        MongoClient.connect(database.main, function (err, db) {
            var collection = db.collection('electrodomestico');
            collection.deleteOne({ "codigo": productID });
            db.close();
        });
    }
}

// ======== ROUTES ========
router.get('/:type', function (req, res) {
    var type = req.params.type;
    if (type == 'libros') {
        MongoClient.connect(database.main, function (err, db) {
            var collection = db.collection('libro');
            collection.find({}).toArray(function (error, result) {
                db.close();
                res.json(result);
            });
        });
    } else if (type == 'dvd') {
        MongoClient.connect(database.main, function (err, db) {
            var collection = db.collection('dvd');
            collection.find({}).toArray(function (error, result) {
                db.close();
                res.json(result);
            });
        });
    } else if (type == 'appliances') {
        MongoClient.connect(database.main, function (err, db) {
            var collection = db.collection('electrodomestico');
            collection.find({}).toArray(function (error, result) {
                db.close();
                res.json(result);
            });
        });
    } else {
        res.send('Type ' + type + ' not found.');
    }
});

router.get('/:type/:id', function (req, res) {
    var type = req.params.type;
    var code = Number(req.params.id);
    if (type == 'libros') {
        MongoClient.connect(database.main, function (err, db) {
            var collection = db.collection('libro');
            collection.find({ "codigo": code }).toArray(function (error, result) {
                db.close();
                res.json(result);
            });
        });
    } else if (type == 'dvd') {
        MongoClient.connect(database.main, function (err, db) {
            var collection = db.collection('dvd');
            collection.find({ "codigo": code }).toArray(function (error, result) {
                db.close();
                res.json(result);
            });
        });
    } else if (type == 'appliances') {
        MongoClient.connect(database.main, function (err, db) {
            var collection = db.collection('electrodomestico');
            collection.find({ "codigo": code }).toArray(function (error, result) {
                db.close();
                res.json(result);
            });
        });
    } else {
        res.send('Type ' + type + ' not found.');
    }
});

router.post('/addBook', function (req, res) {
    var newBook = req.body;
    addProduct(newBook, 'libro');
    res.json({ "Success": 1 });
});

router.post('/addDVD', function (req, res) {
    var newDVD = req.body;
    addProduct(newDVD, 'dvd');
    res.json({ "Success": 1 });
});

router.post('/addAppliance', function (req, res) {
    var newAppliance = req.body;
    addProduct(newAppliance, 'electrodomestico');
    res.json({ "Success": 1 });
});

router.put('/updateBook', function (req, res) {
    var book = req.body;
    var productID = { "codigo": book.codigo };
    var bookParams = {
        "nombre": book.nombre,
        "descripcion": book.descripcion,
        "precio": book.precio,
        "autor": book.autor,
        "ano": book.ano,
        "editorial": book.editorial,
        "numpaginas": book.numpaginas
    };
    updateProduct(productID, bookParams, 'libro');
    res.json({ "Success": 1 });
});

router.put('/updateDVD', function (req, res) {
    var dvd = req.body;
    var productID = { "codigo": dvd.codigo };
    var dvdParams = {
        "nombre": dvd.nombre,
        "descripcion": dvd.descripcion,
        "precio": dvd.precio
    };
    updateProduct(productID, dvdParams, 'dvd');
    res.json({ "Success": 1 });
});

router.put('/updateAppliance', function (req, res) {
    var appliance = req.body;
    var productID = { "codigo": appliance.codigo };
    var applianceParams = {
        "nombre": appliance.nombre,
        "descripcion": appliance.descripcion,
        "precio": appliance.precio,
        "color": appliance.color,
        "voltaje": appliance.voltaje,
        "marca": appliance.marca
    };
    updateProduct(productID, applianceParams, 'appliance');
    res.json({ "Success": 1 });
});

router.delete('/:type/:code', function (req, res) {
    var type = req.params.type;
    var code = Number(req.params.code);
    //console.log(code);
    deleteProduct(code, type);
    res.json({ "Success": 1 });
});


module.exports = router;