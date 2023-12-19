import { Request, Response, NextFunction } from "express";

const { validationResult } = require("express-validator");

import ApiError from "../exceptions/api-error";
import userService from "../service/user-service";

interface RegistrationRequestBody {
  number: number;
  password: string;
  username: string;
}

interface LoginRequestBody {
  number: number;
  password: string;
}

class UserController {
  async registration(
    req: Request<{}, {}, RegistrationRequestBody>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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
      res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async login(
    req: Request<{}, {}, LoginRequestBody>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }

      const { number, password } = req.body;
      const userData = await userService.login(number, password);
      res.json(userData);
    } catch (e) {
      next(e);
    }
  }
}

export default new UserController();
