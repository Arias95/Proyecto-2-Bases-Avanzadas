var express = require("express");
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var database = require('./database.js');
var bodyParser = require("body-parser");

// ======== BODY PARSER INIT ========
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// ======== DB ACCESS FUNCTIONS ========
function retrieveOrders(user, callback) { // Finds orders by users.
    MongoClient.connect(database.main, function (err, db) {
        var collection = db.collection('Orders');
        collection.find({ "cliente": user }).toArray(function (error, result) {
            if (error) throw error;
            db.close();
            callback(result);
        });
    });
}

function retrieveAllOrders(callback) { // Finds all orders.
    MongoClient.connect(database.main, function (err, db) {
        var collection = db.collection('Orders');
        collection.find({}).toArray(function (error, result) {
            if (error) throw error;
            db.close();
            callback(result);
        });
    });
}

// ======== BACKUP FUNCTIONS ========
function amountProducts(orders) {
    var amounts = [];
    for (var i = 0; i < orders.length; i++) {
        var articles = orders[i].articulos;
        var total = 0;
        for (var j = 0; j < articles.length; j++) {
            total += Number(articles[j].cantidad);
        }
        amounts.push(total);
    }

    return amounts;
}

function extractProducts(orders) {
    var products = [];
    for (var i = 0; i < orders.length; i++) {
        var articles = orders[i].articulos;
        for (var j = 0; j < articles.length; j++) {
            products.push(articles[j]);
        }
    }

    return products;
}

function removeProduct(product, list) {
    var result = list.filter(function(a) {
        return a !== product
    });

    return result;
}

function countMentions(product, list) {
    var result = 0;
    for (var i = 0; i < list.length; i++) {
        if (list[i] == product) result++
    }

    return result;
}

function countProducts(products) {
    var productCount = [];
    var result = [];
    for (var j = 0; j < products.length; j++) {
        productCount.push(products[j].articulo);
    }

    while (productCount.length != 0) {
        var current = productCount[0];
        var mentions = {
            "product": current,
            "times": countMentions(current, productCount)
        };
        result.push(mentions);
        productCount = removeProduct(current, productCount);
    } 

    return result;
}

function findHigher(products) {
    var mayor = products[0];
    for (var i = 0; i < products.length; i++) {
        if (products[i].times > mayor.times) {
            mayor = products[i];
        }
    }

    return mayor;
}

function getTop(orders) {
    var products = extractProducts(orders);
    console.log(products);
    var counts = countProducts(products);
    var count = 0;
    var top = [];
    while (count < 3) {
        var higher = findHigher(counts);
        top.push(higher.product);
        //top.push(higher);
        var index = counts.indexOf(higher);
        counts.splice(index, 1);
        count++;
    }

    return top;
}

// ======== ROUTES ========
router.get('/range/:id', function (req, res) {
    var user = req.params.id;
    retrieveOrders(user, function (data) {
        var amounts = amountProducts(data);
        var ranges = {
            "max": Math.max.apply(Math, amounts),
            "min": Math.min.apply(Math, amounts)
        };
        res.json(ranges);
    });
});

router.get('/top', function(req, res) {
    retrieveAllOrders(function(data) {
        var top = getTop(data);
        var top3 = {
            "first": top[0],
            "second": top[1],
            "third": top[2]
        };

        res.json(top3);
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