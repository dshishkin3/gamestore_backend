import { ProductType } from "../models/types";

const ProductModel = require("../models/product-model");
const CategoryModel = require("../models/categories-model");
const UserModel = require("../models/user-model");
const ApiError = require("../exceptions/api-error");

class ProductsService {
    async getHits(): Promise<ProductType[]> {
        const hits: ProductType[] = await ProductModel.find({
            hit: { $ne: false },
        });
        if (!hits) {
            throw ApiError.BadRequest("hits не найдены!");
        }
        return hits;
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
        const categories: ProductType[] = await CategoryModel.find();
        if (!categories) {
            throw ApiError.BadRequest("categories не найдены!");
        }
        return categories;
    }

    async getProductById(
        id: string
    ) {
        if (!id) {
            throw ApiError.BadRequest("id не найдены!");
        }
        const product: ProductType = await ProductModel.findById(id);
        if (!product) {
            throw ApiError.BadRequest("product не найдены!");
        }
        return product;
    }

    async getSearchItem(
        title: string
    ) {
        if (!title) {
            throw ApiError.BadRequest('title не найдены!')
        }
        const regex = new RegExp(title, "i");
        const searchItem: ProductType = await ProductModel.find({
            title: regex,
        });
        return searchItem;
    }

    async getFavorites(
        userId: string
    ) {
        if (!userId) {
            throw ApiError.BadRequest("userId не найдены!")
        }
        const user = await UserModel.findById(userId);
        if (!user) {
            throw ApiError.NotFound("Пользователь не найден");
        }
        return user.favorites;
    }

    async getBasket(
        userId: string
    ) {
        if (!userId) {
            throw ApiError.BadRequest("userId не найдены!")
        }
        const user = await UserModel.findById(userId);
        if (!user) {
            throw ApiError.NotFound("Пользователь не найден");
        }
        return user.basket;
    }

    async addProductToBasket(
        userId: string, product: ProductType
    ) {
        const user = await UserModel.findById(userId);
        user.basket.push(product);
        await user.save();

        return user.basket;
    }

    async addProductToFavorites(
        userId: string, product: ProductType
    ) {
        const user = await UserModel.findById(userId);
        user.favorites.push(product);
        await user.save();

        return user.favorites;
    }

    async removeProductFromFavorites(
        userId: string, productId: string
    ) {
        const user = await UserModel.findById(userId);
        const favorites = user.favorites.filter((favorite: ProductType) => favorite.id !== productId);
        user.favorites = [...favorites];
        await user.save();

        return user.favorites;
    }

    async removeProductFromBasket(
        userId: string, productId: string
    ) {
        const user = await UserModel.findById(userId);
        const basket = user.basket.filter((item: ProductType) => item.id !== productId);
        user.basket = [...basket];
        await user.save();

        return user.basket;
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
