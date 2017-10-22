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
function addProduct(product) {
    MongoClient.connect(database.main, function (err, db) {
        var collection = db.collection('Products');
        collection.insertOne(product, function (err, r) {
            test.equal(null, err);
            test.equal(1, r.insertedCount);
            db.close();
        });
    });
}

function updateProduct(productID, params, type) {
    if (type == 'libro') {
        MongoClient.connect(database.main, function (err, db) {
            var collection = db.collection('Products');
            collection.updateOne({ "codigo": productID, "tipo": "libro" }, {
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
            var collection = db.collection('Products');
            collection.updateOne({ "codigo": productID, "tipo": "dvd" }, {
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
            var collection = db.collection('Products');
            collection.updateOne({ "codigo": productID, "tipo": "electrodomestico" }, {
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
            var collection = db.collection('Products');
            collection.deleteOne({ "codigo": productID, "tipo": "libro" });
            db.close();
        });
    } else if (type == 'dvd') {
        MongoClient.connect(database.main, function (err, db) {
            var collection = db.collection('Products');
            collection.deleteOne({ "codigo": productID, "tipo": "dvd" });
            db.close();
        });
    } else if (type == 'appliance') {
        console.log(productID);
        MongoClient.connect(database.main, function (err, db) {
            console.log(productID);
            var collection = db.collection('Products');
            collection.deleteOne({ "codigo": productID, "tipo": "electrodomestico" });
            db.close();
        });
    }
}

// ======== ROUTES ========
router.get('/:type', function (req, res) {
    var type = req.params.type;
    if (type == 'libros') {
        MongoClient.connect(database.main, function (err, db) {
            var collection = db.collection('Products');
            collection.find({ "tipo": "libro" }).toArray(function (error, result) {
                db.close();
                res.json(result);
            });
        });
    } else if (type == 'dvd') {
        MongoClient.connect(database.main, function (err, db) {
            var collection = db.collection('Products');
            collection.find({ "tipo": "dvd" }).toArray(function (error, result) {
                db.close();
                res.json(result);
            });
        });
    } else if (type == 'electrodomesticos') {
        MongoClient.connect(database.main, function (err, db) {
            var collection = db.collection('Products');
            collection.find({ "tipo": "electrodomestico" }).toArray(function (error, result) {
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
            var collection = db.collection('Products');
            collection.find({ "codigo": code, "tipo": "libro" }).toArray(function (error, result) {
                db.close();
                res.json(result);
            });
        });
    } else if (type == 'dvd') {
        MongoClient.connect(database.main, function (err, db) {
            var collection = db.collection('Products');
            collection.find({ "codigo": code, "tipo": "dvd" }).toArray(function (error, result) {
                db.close();
                res.json(result);
            });
        });
    } else if (type == 'appliances') {
        MongoClient.connect(database.main, function (err, db) {
            var collection = db.collection('Products');
            collection.find({ "codigo": code, "tipo": "electrodomestico" }).toArray(function (error, result) {
                db.close();
                res.json(result);
            });
        });
    } else {
        res.send('Type ' + type + ' not found.');
    }
});

router.post('/addProduct', function (req, res) {
    var newProduct = req.body;
    addProduct(newProduct);
    res.json({ "Success": 1 });
});

router.put('/updateBook', function (req, res) {
    var book = req.body;
    var productID = book.codigo;
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
    var productID = dvd.codigo;
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
    var productID = appliance.codigo;
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