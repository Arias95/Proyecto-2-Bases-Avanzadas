var express = require("express");
var router = express.Router();
var MongoClient = require('mongodb').MongoClient; // TODO: NPM install
var database = require('./database.js');
var bodyParser = require("body-parser"); // TODO: NPM install

// ======== BODY PARSER INIT ========
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// ======== ROUTES ========

// Login function:
router.post('/login', function (req, res)
{
    var loginInfo = req.body; // Gets user data from request's body.
    MongoClient.connect(database.main, function(err, db) {
        var collection = db.collection('Clients');
        collection.find( // Find user with matching data.
        {
        "correo": loginInfo.correo,
        "password": loginInfo.password}).toArray(
            function(error, result)
            {
                if (result.length == 0) // No user found with given details.
                {
                    db.close();
                    res.json({"result" : 0});
                } else // User found
                {
                    db.close();
                    // Returns a success signal (1) and its id.
                    res.json({"result" : 1, "email" : result[0].correo});
                }
            }
        );
    });
});

// Order insertion function: 
router.post('/newOrder', function(req, res) {
    var newOrder = req.body; // Gets data from request's body.
    MongoClient.connect(database.main, function(err, db) {
        var collection = db.collection('Orders');
        collection.insert(newOrder); // Simple insert.
        db.close();
    res.json({"Success" : 1}); // Returns success signal.
    });
});

module.exports = router;