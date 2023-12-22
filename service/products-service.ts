import { ProductType } from "../models/types";

const ProductModel = require("../models/product-model");
const CategoryModel = require("../models/categories-model");
const UserModel = require("../models/user-model");
const ApiError = require("../exceptions/api-error");

class ProductsService {
    async getHits(): Promise<ProductType[]> {
        try {
            const hits: ProductType[] = await ProductModel.find({
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

    async getDiscounts() {
        const discounts: ProductType[] = await ProductModel.find({
            discounts: { $ne: false },
        });
        if (!discounts) {
            throw ApiError.BadRequest("discounts не найдены!");
        }
        return discounts;
    }

    async getCategories() {
        try {
            const categories: ProductType[] = await CategoryModel.find();
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
            const product: ProductType = await ProductModel.findById(id);
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
            const searchItem: ProductType = await ProductModel.find({
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

    async addProductToBasket(userId: string, product: ProductType) {
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

    async addProductToFavorites(userId: string, product: ProductType) {
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
            const favorites = user.favorites.filter((favorite: ProductType) => favorite.id !== productId);
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
            const basket = user.basket.filter((item: ProductType) => item.id !== productId);
            user.basket = [...basket];
            await user.save();

            return user.basket;
        } catch (error) {
            throw ApiError.ServerError("Ошибка сервера");
        }
    }

    async getProductsBySubcategory(
        subcategory: string,
        sort?: string,
        minPrice?: number,
        maxPrice?: number,
        discount?: boolean,
        hit?: boolean,
        inStock?: boolean,
    ) {
        console.log(subcategory, sort, minPrice, discount);
        let query: any = { category: subcategory };

        if (minPrice !== undefined || maxPrice !== undefined) {
            query.price = {};
            if (minPrice !== undefined) query.price.$gte = minPrice;
            if (maxPrice !== undefined) query.price.$lte = maxPrice;
        }

        if (discount !== undefined) query.discount = discount;
        if (hit !== undefined) query.hit = hit;
        if (inStock !== undefined) query.inStock = inStock;

        let products = await ProductModel.find(query);

        if (sort === "popular") {
            products = products.sort((a: ProductType, b: ProductType) => (a.hit === b.hit ? 0 : a.hit ? -1 : 1));
        } else if (sort === "price_asc") {
            products = products.sort((a: ProductType, b: ProductType) => a.price - b.price);
        } else if (sort === "price_desc") {
            products = products.sort((a: ProductType, b: ProductType) => b.price - a.price);
        }

        return products;
    }
}

export default new ProductsService();
