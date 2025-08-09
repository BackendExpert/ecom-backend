// models/Vendor.js
import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
    userID: {

    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    contactPerson: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    websiteUrl: {
        type: String,
        trim: true
    }
}, { timestamps: true });

export default mongoose.model("Vendor", vendorSchema);
