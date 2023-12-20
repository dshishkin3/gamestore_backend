import { Schema, model } from "mongoose";

const ProductSchema = new Schema({
    title: { type: Text, required: true },
    desc: { type: Text, required: true },
    characteristic: { type: Text, required: true },
    category: { type: Text, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    hit: { type: Boolean, required: true },
    promotion: { type: Boolean, required: true },
    urlImages: { type: Array, required: true }
});

module.exports = model("Product", ProductSchema);
