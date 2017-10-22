var express = require("express");
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var database = require('./database.js');
var bodyParser = require("body-parser");

// ======== BODY PARSER INIT ========
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// ======== MAIN FUNCTIONS ========
function retrieveOrders(user, callback) {
    MongoClient.connect(database.main, function (err, db) {
        var collection = db.collection('Orders');
        collection.find({"cliente": user}).toArray(function (error, result) {
            if (error) throw error;
            db.close();
            callback(result);
        });
    });
}

function amountProducts(orders) {
    var amounts = [];
    for (var i = 0 ; i < orders.length ; i++) {
        var articles = orders[i].articulos;
        var total = 0;
        for (var j = 0 ; j < articles.length ; j++) {
            total += Number(articles[j].cantidad);
        }
        amounts.push(total);
    }
    
    return amounts;
}

// ======== ROUTES ========

router.get('/range/:id', function (req, res) {
    var user = req.params.id;
    retrieveOrders(user, function(data) {
        var amounts = amountProducts(data);
        var ranges = {
            "max": Math.max.apply(Math, amounts),
            "min": Math.min.apply(Math, amounts)
        };
        res.json(ranges);
    });
});

// Login function:
router.post('/login', function (req, res) {
    MongoClient.connect(database.main, function (err, db) {
        var collection = db.collection('Admins');
        collection.find( // Find user with matching data.
            {
                "correo": loginInfo.id,
                "clave": loginInfo.clave
            }).toArray(
            function (error, result) {
                if (result.length == 0) // No user found with given details.
                {
                    db.close();
                    res.json({ "result": 0 });
                } else // User found
                {
                    db.close();
                    // Returns a success signal (1) and its id.
                    res.json({ "result": 1, "id": result[0].id });
                }
            }
            );
    });
});

module.exports = router;