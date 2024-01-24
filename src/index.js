import Express from "express"
import "./connection.js"
import { ProductsPriceChecker } from "./products_price_checker.js"

const app = Express()

app.get("/check-prices", async (req, res)=>{
    const productsPriceChecker = new ProductsPriceChecker()
    await productsPriceChecker.check()
    res.send("Precios comparados correctamente.")
})

app.listen(5000, ()=>{
    console.log("App running at port 5000")
})