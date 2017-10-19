var express = require('express');
var app = express();
var client = require('./src/client');

app.use('/client', client);

app.get('/', function(req, res) {
    res.send('Hello, world!');
});
app.listen(3000, function() {
    console.log("Server corriendo en puerto 3000");
});