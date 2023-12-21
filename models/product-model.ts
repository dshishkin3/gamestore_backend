import { Schema, model } from "mongoose";

const ProductSchema = new Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    characteristic: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    hit: { type: Boolean, required: true },
    promotion: { type: Boolean, required: true },
    urlImages: { type: Array, required: true }
});

module.exports = model("Product", ProductSchema);
