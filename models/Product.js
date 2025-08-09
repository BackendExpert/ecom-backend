// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    itemCode: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    regularPrice: {
        type: Number,
        required: true,
        min: 0
    },
    salePrice: {
        type: Number,
        min: 0
    },
    size: {
        type: String,
        enum: ["XS", "S", "M", "L", "XL", "XXL"],
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    SKU: {
        type: String,
        unique: true,
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
    }],
    description: {
        type: String,
        trim: true
    },
    images: [{
        type: String // URL strings
    }],
    productType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductType",
        required: true
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: true
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: true
    },
    netWeight: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
