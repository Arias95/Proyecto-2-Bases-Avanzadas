var express = require("express");
var router = express.Router();
var MongoClient = require('mongodb').MongoClient; // TODO: NPM install
var database = require('./database.js');
var bodyParser = require("body-parser"); // TODO: NPM install

// ======== DATABASE CONNECTIONS ========
var mainDB;

MongoClient.connect(database.main, function (err, db) {
    if (err) { return console.dir(err) }
    mainDB = db;
});

// ======== BODY PARSER INIT ========
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// ======== ROUTES ========

router.post('/login', function (req, res)
{
    var loginInfo = req.body;
    mainDB.collection("cliente").find(
        {
        "correo": loginInfo.correo,
        "clave": loginInfo.clave}).toArray(
            function(error, result)
            {
                if (result.length == 0) // No user found with given details.
                {
                    res.json({"result" : 0});
                } else // User found
                {
                    res.json({"result" : 1, "email" : result[0].correo});
                }
            }
        );
});

router.post('/newOrder', function(req, res) {
    var newOrder = req.body;
    var collection = mainDB.collection('ordenes');
    console.log(newOrder);
    collection.insert(newOrder);
    res.json({"Success" : 1});
});

module.exports = router;