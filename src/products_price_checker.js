import puppeteer from "puppeteer"
import nodemailer from "nodemailer"
import { ProductService } from "./product_service.js"


export class ProductsPriceChecker{

    constructor(){
        this.productService = new ProductService()
    }


    async check(){
        const products = await this.productService.listProducts()
        for (const product of products) {
            const browser = await puppeteer.launch()

            const amazonPage = await browser.newPage()
            await amazonPage.goto("https://amazon.com"+product.amazon_url)

            let amazonPriceWholeEl = await amazonPage.waitForSelector(".a-price-whole")
            let amazonPriceFractionEl = await amazonPage.waitForSelector(".a-price-fraction")

            let amazonPriceWhole = await amazonPage.evaluate(amazonPriceWholeEl=>amazonPriceWholeEl.textContent, amazonPriceWholeEl)
            let amazonPriceFraction = await amazonPage.evaluate(amazonPriceFractionEl=>amazonPriceFractionEl.textContent, amazonPriceFractionEl)

            const amazonPrice = parseFloat(amazonPriceWhole+amazonPriceFraction)

            const meliPage = await browser.newPage()
            await meliPage.goto(product.meli_url)
            let meliPriceEl = await meliPage.waitForSelector(".andes-money-amount__fraction")
            let meliPrice = await meliPage.evaluate(meliPriceEl=>meliPriceEl.textContent, meliPriceEl)

            try {
                let meliPriceCentsEl = await meliPage.waitForSelector(".andes-money-amount__cents")
                let meliPriceCents = await meliPage.evaluate(meliPriceCentsEl=>meliPriceCentsEl.textContent, meliPriceCentsEl)
                meliPrice = meliPrice + "." + meliPriceCents
            } catch (error) {}

            meliPrice = parseFloat(meliPrice)
            if (amazonPrice!=product.amazon_price) {
                await this.notify("El precio del producto " + product.name + " en amazon ha cambiado")
                await this.productService.updateProduct(product.id, { amazon_price: amazonPrice })
            }
            if (meliPrice!=product.meli_price) {
                await this.notify("El precio del producto " + product.name + " en mercado libre ha cambiado")
                await this.productService.updateProduct(product.id, { meli_price: meliPrice })
            }

        }
    }

    async notify(message){
        const transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            }
        })

        await transport.sendMail({
            from: process.env.EMAIL,
            to: process.env.EMAIL,
            subject: "Actualización de precios",
            text: message
        })
    }

}