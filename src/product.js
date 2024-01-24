import mongoose from "mongoose";
const Schema = mongoose.Schema

const ProductSchema = new Schema({
    name: String,
    amazon_price: Number,
    amazon_url: String,
    meli_price: Number,
    meli_url: String
})

export const Product = mongoose.model("Product", ProductSchema)