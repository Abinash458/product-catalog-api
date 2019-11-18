var express = require('express');
const router = express.Router();
var mongoose = require('mongoose');
// var multer = require('multer');

// const storage = multer.diskStorage({
//     destination: function (request, file, cb) {
//         cb(null, './uploads/');
//     },
//     filename: function(request, file, cb) {
//         cb(null, new Date().toISOString() + file.originalname);
//     }
// });

// const fileFilter = (request, file, cb) => {
//     if(file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
//         //accept a file
//         cb(null, false);
//     } else {
//         //reject a file
//         cb(null, true);
//     }
// };

// const upload = multer({
//     storage: storage, 
//     limits:{ 
//         fileSize: 1024 * 1024 * 5 
//     },
//     fileFilter: fileFilter
// });


const Product = require('../models/product');

router.get('/', (request, response, next) => {
    Product.find()
        .select("name description rating price imageUrl _id")
        .exec()
        .then(docs => {
            const res = {
                count: docs.length,
                products: docs.map(doc => {
                    return{
                        _id: doc._id,
                        name: doc.name,
                        description: doc.description,
                        rating: doc.rating,
                        price: doc.price,
                        imageUrl: doc.imageUrl

                        // _id: doc._id,
                        // req: {
                        //     type: 'GET',
                        //     url: 'http://localhost:3002/products/' + doc._id
                        // }
                    }
                })
            };
            // if(docs.length >= 0) {
                response.status(200).json(res);
            // } else {
            //     response.status(404).json({
            //         error: "No entry Found";
            //     })
            //}
        })
        .catch(err => {
            console.log(err);
            response.status(500).json({error: err});
        });
});



router.post('/', (request, response, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: request.body.name,
        description: request.body.description,
        rating: request.body.rating,
        price: request.body.price,
        imageUrl: request.body.imageUrl,
    });
    product.save()
        .then(savedProduct => {
            console.log(savedProduct);
            response.status(201).json({
                message:"Product Created",
                createdProduct: {
                    name: savedProduct.name,
                    description: savedProduct.description,
                    rating: savedProduct.rating,
                    price: savedProduct.price,
                    imageUrl: savedProduct.imageUrl,
                    req: {
                        type: 'GET',
                        url: 'http://localhost:3002/products/' + savedProduct._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            response.status(500).json({error: err});
        });
});

router.get('/:productId', (request, response, next) => {
    const id = request.params.productId;
    Product.findById(id)
        .select("name description rating price imageUrl _id")
        .exec()
        .then(doc => {
            console.log(doc);
            if(doc) {
                response.status(200).json({
                    product: doc,
                    req: {
                        type: 'GET',
                        url: 'http://localhost:3002/products'
                    }
                });
            } else {
                response.status(404).json({error: "No Valid Data Found"});
            }
        })
        .catch(err => {
            console.log(err);
            response.status(500).json({error: err});
        });
});

router.patch('/:productId', (request, response, next) => {
    const id = request.params.productId;
    const updateData = {};
    for(const data of request.body) {
        updateData[data.propName] = data.value;
    }
    Product.update({_id: id}, {$set: updateData})
        .exec()
        .then(result => {
            response.status(200).json({
                message: "Product Updated",
                req: {
                    type: 'GET',
                    url: 'http://localhost:3002/products/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            response.status(500).json({error: err});
        });
});

router.delete('/:productId', (request, response, next) => {
    const id = request.params.productId;
    Product.remove({_id: id})
        .exec()
        .then(result => {
            response.status(200).json({
                message: "Product Deleted",
                req: {
                    type: 'POST',
                    url: 'http://localhost:3002/products',
                    body: {
                        name: 'String',
                        description: 'String',
                        rating: 'Number',
                        price: 'Number'
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            response.status(500).json({error: err});
        });
});

module.exports = router;