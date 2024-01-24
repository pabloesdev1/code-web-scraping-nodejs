import { Product } from "./product.js";

export class ProductService{

    constructor(){}

    async listProducts(){
        return await Product.find({})
    }

    async updateProduct(productId, data){
        await Product.findByIdAndUpdate(productId, data)
    }
}