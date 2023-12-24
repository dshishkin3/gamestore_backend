import { Request, Response, NextFunction } from "express";

const { validationResult } = require("express-validator");

const ApiError = require("../exceptions/api-error");
import userService from "../service/user-service";
import { LoginRequestBody, RegistrationRequestBody } from "../models/types";

class UserController {
    async registration(
        req: Request<{}, {}, RegistrationRequestBody>,
        res: Response,
        next: NextFunction
    ): Promise<any> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation error", errors.array()));
            }

            const { number, password, username } = req.body;
            const userData = await userService.registration(
                number,
                password,
                username
            );
            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(
        req: any,
        res: Response,
        next: NextFunction
    ): Promise<any> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .json({ error: "Проверьте корректность введенных данных!" });
            }

            const { number, password } = req.body;
            const userData = await userService.login(number, password);
            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req: Request<{}, {}, LoginRequestBody>,
        res: Response,
        next: NextFunction) {
        try {
            const { refreshToken } = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie("refreshToken");
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    async updateUser(req: Request<{}, {}, RegistrationRequestBody>,
        res: Response,
        next: NextFunction) {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                  return next(ApiError.BadRequest("Validation error", errors.array()));
                }
                const userData = await userService.update(req.body);
                return res.json(userData);
              } catch (e) {
                next(e);
              }
    }
}

export default new UserController();
