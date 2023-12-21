import productsService from "../service/products-service";
import { Request, Response } from "express";

class ProductsController {
    async getHits(req: Request, res: Response) {
        const hits = await productsService.getHits();
        res.json(hits);
    }

    async getCategories(req: Request, res: Response) {
        const products = await productsService.getCategories();
        res.json(products);
    }

    async getProductById(req: Request, res: Response) {

        const product = await productsService.getProductById(req.params.id);
        res.json(product);
    }

    async getSearchItem(req: Request, res: Response) {

        const product = await productsService.getSearchItem(req.params.title);
        res.json(product);
    }

    async getFavorites(req: Request, res: Response) {
        const favorites = await productsService.getFavorites(req.params.userId);
        res.json(favorites);
    }

    async getBasket(req: Request, res: Response) {
        const basket = await productsService.getBasket(req.params.userId);
        res.json(basket);
    }

    async addProductToBasket(req: Request, res: Response) {
        const basket = await productsService.addProductToBasket(req.params.userId, req.body);
        res.json(basket);
    }

    async addProductToFavorites(req: Request, res: Response) {
        const favorites = await productsService.addProductToFavorites(req.params.userId, req.body);
        res.json(favorites);
    }

    async removeProductFromFavorites(req: Request, res: Response) {
        const { id } = req.body
        const favorites = await productsService.removeProductFromFavorites(req.params.userId, id);

        res.json(favorites);
    }
    async removeProductFromBasket(req: Request, res: Response) {
        const { id } = req.body
        const basket = await productsService.removeProductFromBasket(req.params.userId, id);

        res.json(basket);
    }
}

export default new ProductsController();