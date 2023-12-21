import { Request, Response, NextFunction } from "express";
import { body } from "express-validator";

const Router = require("express").Router;
const router = new Router();

import UserController from "../controllers/user-controller";
import ProductsController from "../controllers/products-controller";
import { LoginRequestBody, RegistrationRequestBody } from "../models/types";

const authMiddleware = require("../middlewares/auth-middleware");

// GET
router.get("/hits", (req: Request, res: Response) => {
  ProductsController.getHits(req, res);
});

router.get("/categories", (req: Request, res: Response) => {
  ProductsController.getCategories(req, res);
});

router.get("/search/:title", (req: Request, res: Response) => {
  ProductsController.getSearchItem(req, res);
});

router.get("/products/:id", (req: Request, res: Response) => {
  ProductsController.getProductById(req, res);
});

router.get("/favorites/:userId", (req: Request, res: Response) => {
  ProductsController.getFavorites(req, res);
});

router.get("/basket/:userId", (req: Request, res: Response) => {
  ProductsController.getBasket(req, res);
});

// get discounts
// get subcategories
// get subcategories items [FILTER]

// POST
router.post(
  "/basket/:userId",
  authMiddleware,
  (req: Request, res: Response) => {
    ProductsController.addProductToBasket(req, res);
  }
);

router.post("/favorites/:userId", (req: Request, res: Response) => {
  ProductsController.addProductToFavorites(req, res);
});
// change info user
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
router.post("/logout", UserController.logout);

// PUT
// change info user

// DELETE
router.delete("/basket/:userId", (req: Request, res: Response) => {
  ProductsController.removeProductFromBasket(req, res);
});

router.delete("/favorites/:userId", (req: Request, res: Response) => {
  ProductsController.removeProductFromFavorites(req, res);
});
module.exports = router;
