import productsService from "../service/products-service";
import { Request, Response } from "express";

class ProductsController {
    async getHits(req: Request, res: Response) {
        const hits = await productsService.getHits();
        res.json(hits);
    }

    async getProducts(req: Request, res: Response) {
        const products = await productsService.getProducts();
        res.json(products);
    }
}

export default new ProductsController();