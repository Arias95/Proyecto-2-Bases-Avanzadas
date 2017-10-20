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

// Login function:
router.post('/login', function (req, res)
{
    var loginInfo = req.body; // Gets user data from request's body.
    mainDB.collection("cliente").find( // Find user with matching data.
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
                    // Returns a positive signal (1) and it's id.
                    res.json({"result" : 1, "email" : result[0].correo});
                }
            }
        );
});

// Order insertion function: 
router.post('/newOrder', function(req, res) {
    var newOrder = req.body; // Gets data from request's body.
    var collection = mainDB.collection('ordenes');
    console.log(newOrder);
    collection.insert(newOrder); // Simple insert.
    res.json({"Success" : 1}); // Returns positive signal.
});

module.exports = router;