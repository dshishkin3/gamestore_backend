import { NextFunction, Request, Response } from "express";
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");
import productsService from "../service/products-service";

class ProductsController {
    async getHits(
        req: Request, res: Response
    ) {
        try {
            const hits = await productsService.getHits();
            res.json(hits);
        } catch (error) {
            throw ApiError.ServerError("Ошибка сервера");
        }

    }

    async getCategories(
        req: Request, res: Response
    ) {
        try {
            const products = await productsService.getCategories();
            res.json(products);
        } catch (error) {
            throw ApiError.ServerError("Ошибка сервера");
        }
    }

    async getProductById(
        req: Request, res: Response
    ) {
        try {
            const product = await productsService.getProductById(req.params.id);
            res.json(product);
        } catch (error) {
            throw ApiError.ServerError("Ошибка сервера");
        }

    }

    async getSearchItem(
        req: Request, res: Response
    ) {
        try {
            const product = await productsService.getSearchItem(req.params.title);
            res.json(product);
        } catch (error) {
            throw ApiError.ServerError("Ошибка сервера");
        }
    }

    async getFavorites(
        req: Request, res: Response
    ) {
        try {
            const favorites = await productsService.getFavorites(req.params.userId);
            res.json(favorites);
        } catch (error) {
            throw ApiError.ServerError("Ошибка сервера");
        }
    }

    async getBasket(
        req: Request, res: Response
    ) {
        try {
            const basket = await productsService.getBasket(req.params.userId);
            res.json(basket);
        } catch (error) {
            throw ApiError.ServerError("Ошибка сервера");
        }
    }

    async addProductToBasket(
        req: any, res: Response, next: NextFunction
    ) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation error", errors.array()));
            }
            const basket = await productsService.addProductToBasket(req.user.id, req.body);
            res.json(basket);
        } catch (e) {
            throw ApiError.ServerError("Ошибка сервера");
        }
    }

    async addProductToFavorites(
        req: any, res: Response, next: NextFunction
    ) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation error", errors.array()));
            }
            const favorites = await productsService.addProductToFavorites(req.user.id, req.body);
            res.json(favorites);
        } catch (e) {
            throw ApiError.ServerError("Ошибка сервера");
        }
    }

    async removeProductFromFavorites(
        req: any, res: Response, next: NextFunction
    ) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation error", errors.array()));
            }
            const { id } = req.body;
            const favorites = await productsService.removeProductFromFavorites(req.user.id, id);

            res.json(favorites);
        } catch (e) {
            throw ApiError.ServerError("Ошибка сервера");
        }
    }

    async removeProductFromBasket(
        req: any, res: Response, next: NextFunction
    ) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation error", errors.array()));
            }
            const { id } = req.body;
            const basket = await productsService.removeProductFromBasket(req.user.id, id);
            res.json(basket);
        } catch (e) {
            throw ApiError.ServerError("Ошибка сервера");
        }
    }

    async getProductsBySubcategory(
        req: Request, res: Response, next: NextFunction
    ) {
        try {
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
        } catch (error) {
            throw ApiError.ServerError("Ошибка сервера");
        }
    }
}

export default new ProductsController();
