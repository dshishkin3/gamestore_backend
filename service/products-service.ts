import { ProductTypes } from "../models/types";

const ProductModel = require("../models/product-model");
const CategoryModel = require("../models/categories-model");
const UserModel = require("../models/user-model");
const ApiError = require("../exceptions/api-error");

class ProductsService {
    async getHits(): Promise<ProductTypes[]> {
        try {
            const hits: ProductTypes[] = await ProductModel.find({
                hit: { $ne: false },
            });
            if (!hits) {
                throw ApiError.BadRequest("hits не найдены!");
            }
            return hits;
        } catch (error) {
            throw ApiError.BadRequest("categories не найдены!");
        }
    }

    async getCategories() {
        try {
            const categories: ProductTypes[] = await CategoryModel.find();
            if (!categories) {
                throw ApiError.BadRequest("categories не найдены!");
            }
            return categories;
        } catch (error) {
            throw ApiError.ServerError("Ошибка сервера");
        }
    }

    async getProductById(id: string) {
        try {
            if (!id) {
                throw ApiError.BadRequest("id не найдены!");
            }
            const product: ProductTypes = await ProductModel.findById(id);
            if (!product) {
                throw ApiError.BadRequest("product не найдены!");
            }
            return product;
        } catch (error) {
            throw ApiError.ServerError("Ошибка сервера");
        }
    }

    async getSearchItem(title: string) {
        try {
            const regex = new RegExp(title, "i");
            const searchItem: ProductTypes = await ProductModel.find({
                title: regex,
            });
            return searchItem;
        } catch (error) {
            throw ApiError.ServerError("Ошибка сервера");
        }
    }

    async getFavorites(userId: string) {
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                throw ApiError.NotFound("Пользователь не найден");
            }

            return user.favorites;
        } catch (error) {
            throw ApiError.ServerError("Ошибка сервера");
        }
    }

    async getBasket(userId: string) {
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                throw ApiError.NotFound("Пользователь не найден");
            }

            return user.basket;
        } catch (error) {
            throw ApiError.ServerError("Ошибка сервера");
        }
    }

    async addProductToBasket(userId: string, product: ProductTypes) {
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                throw ApiError.NotFound("Пользователь не найден");
            }
            user.basket.push(product);
            await user.save();

            return user.basket;
        } catch (error) {
            throw ApiError.ServerError("Ошибка сервера");
        }
    }

    async addProductToFavorites(userId: string, product: ProductTypes) {
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                throw ApiError.NotFound("Пользователь не найден");
            }
            user.favorites.push(product);
            await user.save();

            return user.favorites;
        } catch (error) {
            throw ApiError.ServerError("Ошибка сервера");
        }
    }

    async removeProductFromFavorites(userId: string, productId: string) {
        try {
            console.log(productId);
            const user = await UserModel.findById(userId);
            if (!user) {
                throw ApiError.NotFound("Пользователь не найден");
            }
            const favorites = user.favorites.filter((favorite: ProductTypes) => favorite.id !== productId);
            user.favorites = [...favorites];
            await user.save();

            return user.favorites;
        } catch (error) {
            throw ApiError.ServerError("Ошибка сервера");
        }
    }

    async removeProductFromBasket(userId: string, productId: string) {
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                throw ApiError.NotFound("Пользователь не найден");
            }
            const basket = user.basket.filter((item: ProductTypes) => item.id !== productId);
            user.basket = [...basket];
            await user.save();

            return user.basket;
        } catch (error) {
            throw ApiError.ServerError("Ошибка сервера");
        }
    }

    async getProductsBySubcategory(subcategory: string) {
        console.log(subcategory);
        const products = await ProductModel.find({ category: subcategory });
        return products;
    }
}

export default new ProductsService();
