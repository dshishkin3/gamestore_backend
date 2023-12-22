import { NextFunction, Request, Response } from "express";
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");

import productsService from "../service/products-service";

class ProductsController {
    async getHits(req: Request, res: Response) {
        const hits = await productsService.getHits();
        res.json(hits);
    }

    async getDiscounts(req: Request, res: Response, next: NextFunction) {
        const products = await productsService.getDiscounts();

        res.json(products);
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
        const { id } = req.body;
        const favorites = await productsService.removeProductFromFavorites(req.params.userId, id);

        res.json(favorites);
    }
    async removeProductFromBasket(req: Request, res: Response) {
        const { id } = req.body;
        const basket = await productsService.removeProductFromBasket(req.params.userId, id);

        res.json(basket);
    }

    async getProductsBySubcategory(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest("Validation error", errors.array()));
        }

        const subcategory = req.query.subcategory as string;
        const sort = req.query.sort as string | undefined;
        const minPrice = parseFloat(req.query.minPrice as string) || undefined;
        const maxPrice = parseFloat(req.query.maxPrice as string) || undefined;
        const discount = req.query.discount === "true" ? true : undefined;
        const hit = req.query.hit === "true" ? true : undefined;
        const inStock = req.query.inStock === "true" ? true : undefined;

        const products = await productsService.getProductsBySubcategory(
            subcategory,
            sort,
            minPrice,
            maxPrice,
            discount,
            hit,
            inStock,
        );
        res.json(products);
    }
}

export default new ProductsController();
