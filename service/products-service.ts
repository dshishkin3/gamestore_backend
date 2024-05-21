import { CategoryType, ProductType } from "../models/types";

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
        const categories: CategoryType[] = await CategoryModel.find();
        if (!categories) {
            throw ApiError.BadRequest("categories не найдены!");
        }
        return categories;
    }

    async getCategoryByTitle(title: string) {
        console.log(title);
        if (!title) {
            throw ApiError.BadRequest("title не найдены!");
        }
        const category: CategoryType = await CategoryModel.findOne({ originTitle: title });
        if (!category) {
            throw ApiError.BadRequest(`товар с таким ${title} title не найдены!`);
        }
        return category;
    }

    async getProductById(id: string) {
        if (!id) {
            throw ApiError.BadRequest("id не найдены!");
        }
        const product: ProductType = await ProductModel.findById(id);
        if (!product) {
            throw ApiError.BadRequest("product не найдены!");
        }
        return product;
    }

    async getSearchItem(title: string) {
        if (!title) {
            throw ApiError.BadRequest("title не найдены!");
        }
        const regex = new RegExp(title, "i");
        const searchItem: ProductType = await ProductModel.find({
            title: regex,
        });
        return searchItem;
    }

    async getFavorites(userId: string) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw ApiError.NotFound("Пользователь не найден");
        }

        if (!user.favorites.isLength) {
            return [];
        }

        const favorites = await ProductModel.find({ _id: { $in: user.favorites } });
        return favorites;
    }

    async getBasket(userId: string) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw ApiError.NotFound("Пользователь не найден");
        }

        if (!user.basket.isLength) {
            return [];
        }

        const basket = await ProductModel.find({ _id: { $in: user.basket } });
        return basket;
    }

    async addProductToBasket(userId: string, productId: ProductType) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw ApiError.BadRequest("Пользователь не найден");
        }
        user.basket.push(productId);
        await user.save();

        return user.basket;
    }

    async addProductToFavorites(userId: string, productId: ProductType) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw ApiError.BadRequest("Пользователь не найден");
        }
        user.favorites.push(productId);
        await user.save();

        return user.favorites;
    }

    async removeProductFromFavorites(userId: string, productId: string) {
        if (!productId) {
            throw ApiError.BadRequest("productId не найден");
        }
        const user = await UserModel.findById(userId);
        if (!user) {
            throw ApiError.BadRequest("Пользователь не найден");
        }
        const favorites = user.favorites.filter((favorite: ProductType) => favorite.id !== productId);
        user.favorites = [...favorites];
        await user.save();

        return user.favorites;
    }

    async removeProductFromBasket(userId: string, productId: string) {
        if (!productId) {
            throw ApiError.BadRequest("productId не найден");
        }
        const user = await UserModel.findById(userId);
        if (!user) {
            throw ApiError.BadRequest("Пользователь не найден");
        }
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

        return { title: subcategory, subcategories: products };
    }

    async getProductsByIds(ids: string[]) {
        if (!ids || ids.length === 0) {
            throw new ApiError.BadRequest("Массив идентификаторов не должен быть пустым");
        }

        const products = await ProductModel.find({
            _id: { $in: ids },
        }).exec();

        if (!products || products.length === 0) {
            throw ApiError.NotFound("Продукты не найдены");
        }

        return products;
    }
}

export default new ProductsService();
