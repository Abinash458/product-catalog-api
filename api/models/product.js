var mongoose = require('mongoose');

var productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    description: {type: String, required: true},
    rating: {type: String, required: true},
    price: {type: String, required: true},
    imageUrl: {type: String, required: true}
});

module.exports = mongoose.model('Product' ,productSchema);