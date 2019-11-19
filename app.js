var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');

const productRoutes = require('./api/routes/products');

mongoose.connect('mongodb+srv://product:product@mux-product-catalog-pgobs.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true });

app.use(cors());
app.use(bodyParser.json());
//can handel more complex body part(i.e extended: true) or can handel only strings and arrays (i.e. extended: false)
app.use(bodyParser.urlencoded({extended: false}));

//CORS (Cross-Origine-Resourse-Sharing) ERROS.
// app.use((request, response, next) => {
//     //Allow all type of requests
//     response.header('Access-Control-Allow-Origin', '*');
//     //Allow type of headers that are mentioned
//     response.header('Access-Control-Allow-Headers', "Origine, X-Requested-With, Content-Type, Accept, Authorization");
//     //Verify if the browser send a OPTION then allow the following methods.
//     if(request.method === 'OPTIONS') {
//         request.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH');
//         response.status(200).json({});
//     }
//     next();
// });

app.use('/products', productRoutes);

app.use((request, response, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, request, response, next) => {
    response.status(error.status || 500);
    response.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;