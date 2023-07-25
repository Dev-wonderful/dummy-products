const mongoose = require('mongoose')

const deptProductsSchema = new mongoose.Schema({
    d_Id: {type: String, required: true},
    products: {type: Array}
}, {collection: "Products"})

const deptProducts = mongoose.model("Products", deptProductsSchema)

module.exports = deptProducts