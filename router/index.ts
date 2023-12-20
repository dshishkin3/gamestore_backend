import { Request, Response, NextFunction } from "express";
import { body } from "express-validator";

const Router = require("express").Router;
const router = new Router();

import UserController from "../controllers/user-controller";
import ProductsController from "../controllers/products-controller";
import { LoginRequestBody, RegistrationRequestBody } from "../models/types";

// GET
// get hits
router.get("/hits", (req: Request, res: Response) => {
    ProductsController.getHits(req, res);
});
// get discounts
// get categories
// get subcategories
// get subcategories items [FILTER]
// get search items
// get product
router.get("/products", (req: Request, res: Response) => {
    ProductsController.getProducts(req, res);
});
// get favorites user
// get basket user

// POST
// change info user
// add to fav
// add to basket
// logout (+ clear cookies)
router.post(
    "/registration",
    body("number").isLength({ min: 11, max: 12 }),
    body("password").isLength({ min: 3, max: 32 }),
    body("username").isLength({ min: 3, max: 32 }),
    (
        req: Request<{}, {}, RegistrationRequestBody>,
        res: Response,
        next: NextFunction
    ) => {
        UserController.registration(req, res, next);
    }
);
router.post(
    "/login",
    body("number").isLength({ min: 11, max: 12 }),
    body("password").isLength({ min: 3, max: 32 }),
    (
        req: Request<{}, {}, LoginRequestBody>,
        res: Response,
        next: NextFunction
    ) => {
        UserController.login(req, res, next);
    }
);

// PUT
// change info user

// DELETE

module.exports = router;
