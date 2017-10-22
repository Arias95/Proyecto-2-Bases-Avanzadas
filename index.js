var express = require('express');
var app = express();
var client = require('./src/client');
var product = require('./src/products.js');
var admin = require('./src/admin.js');

app.use('/client', client);
app.use('/product', product);
app.use('/admin', admin);

app.get('/', function (req, res) {
    res.send('Hello, world!');
});
app.listen(3000, function () {
    console.log("Server corriendo en puerto 3000");
});