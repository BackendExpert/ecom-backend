// models/ProductType.js
import mongoose from "mongoose";

const productTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, { timestamps: true });

export default mongoose.model("ProductType", productTypeSchema);
