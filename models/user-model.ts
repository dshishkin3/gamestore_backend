const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
    number: { type: Number, unique: true, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    favorites: { type: Array, default: [] },
    basket: { type: Array, default: [] },
});

module.exports = model("User", UserSchema);
