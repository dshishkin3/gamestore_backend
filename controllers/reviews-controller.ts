import { NextFunction, Request, Response } from "express";
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");
import ReviewsService from "../service/reviews-service";
import { ReviewTypeBody } from "../models/types";

class ReviewsController {
    async addReview(req: Request<ReviewTypeBody>, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation error", errors.array()));
            }

            const { userId, productId, star, comment, experience } = req.body;

            const userData = await ReviewsService.addReview(userId, productId, star, comment, experience);
            return res.json(userData);
        } catch (e) {
            throw ApiError.ServerError("Ошибка сервера");
        }
    }

    async deleteReview(req: Request<ReviewTypeBody>, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation error", errors.array()));
            }

            const { userId, productId, reviewId } = req.body;

            const userData = await ReviewsService.deleteReview(userId, productId, reviewId);
            return res.json(userData);
        } catch (e) {
            throw ApiError.ServerError("Ошибка сервера");
        }
    }
}
export default new ReviewsController();
