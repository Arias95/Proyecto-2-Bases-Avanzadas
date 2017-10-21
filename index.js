var express = require('express');
var app = express();
var client = require('./src/client');
var product = require('./src/products.js');

app.use('/client', client);
app.use('/product', product);

app.get('/', function (req, res) {
    res.send('Hello, world!');
});
app.listen(3000, function () {
    console.log("Server corriendo en puerto 3000");
});