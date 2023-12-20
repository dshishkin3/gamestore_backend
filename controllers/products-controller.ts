import productsService from "../service/products-service";
import { Request, Response } from "express";
class ProductsController {
    async getHits(req: Request, res: Response) {
        const hits = await productsService.getHits();
        res.json(hits);
    }

}

export default new ProductsController();