// models/Brand.js
import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    logo: {
        type: String, // image URL
        trim: true
    },
    websiteUrl: {
        type: String,
        trim: true
    }
}, { timestamps: true });

export default mongoose.model("Brand", brandSchema);
