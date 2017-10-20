var express = require("express");
var router = express.Router();
var MongoClient = require('mongodb').MongoClient
var test = require('assert');
var database = require('./database.js');
var bodyParser = require("body-parser");

// ======== DATABASE CONNECTIONS ========
var mainDB;

// ======== BODY PARSER INIT ========
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

function addProduct(product, type) {
    if (type == 'libro') {
        MongoClient.connect(database.main, function(err, db) {
            var collection = db.collection('libro');
            collection.insertOne(product, function(err, r) {
                test.equal(null, err);
                test.equal(1, r.insertedCount);
                db.close();
            });
        });
    } else if (type == 'dvd') {
        MongoClient.connect(database.main, function(err, db) {
            var collection = db.collection('dvd');
            collection.insertOne(product, function(err, r) {
                test.equal(null, err);
                test.equal(1, r.insertedCount);
                db.close();
            });
        });
    } else if (type == 'electrodomestico') {
        MongoClient.connect(database.main, function(err, db) {
            var collection = db.collection('electrodomestico');
            collection.insertOne(product, function(err, r) {
                test.equal(null, err);
                test.equal(1, r.insertedCount);
                db.close();
            });
        });
    }
}

// ======== ROUTES ========
router.post('/addBook', function (req, res) {
    var newBook = req.body;
    addProduct(newBook, 'libro');
    res.json({"Success" : 1});
});

router.post('/addDVD', function (req, res) {
    var newDVD = req.body;
    addProduct(newDVD, 'dvd');
    res.json({"Success" : 1});
});

router.post('/addAppliance', function (req, res) {
    var newAppliance = req.body;
    addProduct(newAppliance, 'electrodomestico');
    res.json({"Success" : 1});
});


module.exports = router;