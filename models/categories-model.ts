import { Schema, model } from "mongoose";

const CategorySchema = new Schema({
    title: { type: String, required: true },
    originTitle:{type:String,required: true},
    urlImg: { type: String, required: true },
    subcategories: { type: Array, required: true },
});

module.exports = model("Category", CategorySchema);
