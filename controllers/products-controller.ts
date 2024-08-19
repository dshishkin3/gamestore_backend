import { NextFunction, Request, Response } from "express";
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");
import productsService from "../service/products-service";
import reviewsService from "../service/reviews-service";

class ProductsController {
    async getAllProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const hits = await productsService.getAllProducts();
            res.json(hits);
        } catch (e) {
            next(ApiError.ServerError("Ошибка сервера", e));
        }
    }

    async getHits(req: Request, res: Response, next: NextFunction) {
        try {
            const hits = await productsService.getHits();
            res.json(hits);
        } catch (e) {
            next(ApiError.ServerError("Ошибка сервера", e));
        }
    }

    async getDiscounts(req: Request, res: Response, next: NextFunction) {
        try {
            const products = await productsService.getDiscounts();
            res.json(products);
        } catch (e) {
            next(ApiError.ServerError("Ошибка сервера", e));
        }
    }

    async getCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const products = await productsService.getCategories();
            res.json(products);
        } catch (e) {
            next(ApiError.ServerError("Ошибка сервера", e));
        }
    }
    async getCategoryByTitle(req: Request, res: Response, next: NextFunction) {
        try {
            console.log(req.params.title);
            const category = await productsService.getCategoryByTitle(req.params.title);
            res.json(category);
        } catch (e) {
            next(ApiError.ServerError("Ошибка сервера", e));
        }
    }
    async getProductById(req: Request, res: Response, next: NextFunction) {
        try {
            const product = await productsService.getProductById(req.params.id);
            res.json(product);
        } catch (e) {
            next(ApiError.ServerError("Ошибка сервера", e));
        }
    }

    async getSearchItem(req: Request, res: Response, next: NextFunction) {
        try {
            const product = await productsService.getSearchItem(req.params.title);
            res.json(product);
        } catch (e) {
            next(ApiError.ServerError("Ошибка сервера", e));
        }
    }

    async getFavorites(req: Request, res: Response, next: NextFunction) {
        try {
            const favorites = await productsService.getFavorites(req.params.userId);
            res.json(favorites);
        } catch (e) {
            next(ApiError.ServerError("Ошибка сервера", e));
        }
    }

    async getBasket(req: Request, res: Response, next: NextFunction) {
        try {
            const basket = await productsService.getBasket(req.params.userId);
            res.json(basket);
        } catch (e) {
            next(ApiError.ServerError("Ошибка сервера", e));
        }
    }

    async addProductToBasket(req: any, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation error", errors.array()));
            }
            const basket = await productsService.addProductToBasket(req.user.id, req.body);
            res.json(basket);
        } catch (e) {
            next(ApiError.ServerError("Ошибка сервера", e));
        }
    }

    async addProductToFavorites(req: any, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation error", errors.array()));
            }
            const favorites = await productsService.addProductToFavorites(req.user.id, req.body);
            res.json(favorites);
        } catch (e) {
            next(ApiError.ServerError("Ошибка сервера", e));
        }
    }

    async removeProductFromFavorites(req: any, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation error", errors.array()));
            }
            const { id } = req.body;
            const favorites = await productsService.removeProductFromFavorites(req.user.id, id);

            res.json(favorites);
        } catch (e) {
            next(ApiError.ServerError("Ошибка сервера", e));
        }
    }

    async removeProductFromBasket(req: any, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation error", errors.array()));
            }
            const { id } = req.body;
            const basket = await productsService.removeProductFromBasket(req.user.id, id);
            res.json(basket);
        } catch (e) {
            next(ApiError.ServerError("Ошибка сервера", e));
        }
    }

    async getProductsBySubcategory(req: Request, res: Response, next: NextFunction) {
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
        } catch (e) {
            next(ApiError.ServerError("Ошибка сервера", e));
        }
    }

    async getScoreProduct(req: any, res: Response, next: NextFunction) {
        try {
            const score = await reviewsService.getScoreProduct(req.params.id);
            res.json(score);
        } catch (e) {
            next(ApiError.ServerError("Ошибка сервера", e));
        }
    }

    async getProductsByIds(req: Request, res: Response, next: NextFunction) {
        try {
            const products = await productsService.getProductsByIds(req.body);
            res.json(products);
        } catch (e) {
            next(ApiError.ServerError("Ошибка сервера", e));
        }
    }

    async addProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const products = await productsService.addProduct(req.body);
            res.json(products);
        } catch (e) {
            next(ApiError.ServerError("Ошибка сервера", e));
        }
    }

    async deleteProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const products = await productsService.deleteProduct(req.params.id);
            res.json(products);
        } catch (e) {
            next(ApiError.ServerError("Ошибка сервера", e));
        }
    }

    async editProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const products = await productsService.editProduct(req.params.id, req.body);
            res.json(products);
        } catch (e) {
            next(ApiError.ServerError("Ошибка сервера", e));
        }
    }
}

export default new ProductsController();
