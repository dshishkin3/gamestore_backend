import { ProductType, ReviewTypeBody } from "../models/types";

const ProductModel = require("../models/product-model");
const CategoryModel = require("../models/categories-model");
const UserModel = require("../models/user-model");
const ApiError = require("../exceptions/api-error");

const { v4: uuidv4 } = require("uuid");

class ReviewsService {
    async getScoreProduct(productId: string) {
        try {
            const product = await ProductModel.findById(productId);

            if (!product) {
                return null;
            }

            if (product.reviews.length === 0) {
                return null;
            }

            const totalStars = product.reviews.reduce((sum: any, review: any) => sum + review.star, 0);
            const averageScore = totalStars / product.reviews.length;

            return averageScore;
        } catch (error) {
            throw new ApiError(500, "Internal Server Error");
        }
    }

    async addReview(userId: string, productId: string, star: number, comment: {}, experience: string) {
        try {
            const product = await ProductModel.findById(productId);

            if (!product) {
                throw new ApiError(404, "Product not found");
            }

            const newReview = {
                id: uuidv4(),
                userId,
                star,
                comment,
                experience,
            };

            product.reviews.push(newReview);

            await product.save();

            return newReview;
        } catch (error) {
            throw new ApiError(500, "Internal Server Error");
        }
    }

    async deleteReview(userId: string, productId: string, reviewId: string) {
        try {
            const product = await ProductModel.findById(productId);

            if (!product) {
                throw new ApiError(404, "Product not found");
            }

            const reviewIndex = product.reviews.findIndex((review: any) => review.id === reviewId);

            if (reviewIndex === -1) {
                throw new ApiError(404, "Review not found");
            }

            if (product.reviews[reviewIndex].userId !== userId) {
                throw new ApiError(403, "Unauthorized: User does not have permission to delete this review");
            }

            product.reviews.splice(reviewIndex, 1);

            await product.save();

            return { success: true, message: "Review deleted successfully" };
        } catch (error) {
            throw new ApiError(500, "Internal Server Error");
        }
    }
}
export default new ReviewsService();
