var express = require("express");
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var database = require('./database.js');
var bodyParser = require("body-parser"); 

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
    mainDB.collection("admin").find( // Find user with matching data.
        {
        "correo": loginInfo.id,
        "clave": loginInfo.clave}).toArray(
            function(error, result)
            {
                if (result.length == 0) // No user found with given details.
                {
                    res.json({"result" : 0});
                } else // User found
                {
                    // Returns a success signal (1) and its id.
                    res.json({"result" : 1, "id" : result[0].id});
                }
            }
        );
});

module.exports = router;