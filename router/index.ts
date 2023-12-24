import { Request, Response, NextFunction } from "express";
import { body, query } from "express-validator";
import UserController from "../controllers/user-controller";
import ProductsController from "../controllers/products-controller";
import { LoginRequestBody, RegistrationRequestBody } from "../models/types";
import reviewsController from "../controllers/reviews-controller";

const Router = require("express").Router;
const router = new Router();

const authMiddleware = require("../middlewares/auth-middleware");

// GET
router.get("/hits", (req: Request, res: Response) => {
    ProductsController.getHits(req, res);
});

router.get("/categories", (req: Request, res: Response) => {
    ProductsController.getCategories(req, res);
});

router.get("/discounts", (req: Request, res: Response, next: NextFunction) => {
    ProductsController.getDiscounts(req, res, next);
});

router.get("/search/:title", (req: Request, res: Response) => {
    ProductsController.getSearchItem(req, res);
});

router.get("/product/:id", (req: Request, res: Response) => {
    ProductsController.getProductById(req, res);
});

router.get("/favorites/:userId", (req: Request, res: Response) => {
    ProductsController.getFavorites(req, res);
});

router.get("/basket/:userId", (req: Request, res: Response) => {
    ProductsController.getBasket(req, res);
});

router.get(
    "/getProductsBySubcategory",
    query("subcategory").isString(),
    query("sort").optional().isIn(["popular", "price_asc", "price_desc"]),
    query("minPrice").optional().isNumeric(),
    query("maxPrice").optional().isNumeric(),
    query("discount").optional().isBoolean(),
    query("hit").optional().isBoolean(),
    query("inStock").optional().isBoolean(),
    (req: Request, res: Response, next: NextFunction) => {
        ProductsController.getProductsBySubcategory(req, res, next);
    },
);

router.get("/getScoreProduct/:id", ProductsController.getScoreProduct);

// get discounts
// POST
router.post(
    "/addToBasket",
    body("id").isString(),
    body("title").isString(),
    body("desc").isString(),
    body("characteristic").isString(),
    body("category").isString(),
    body("price").isInt(),
    body("oldPrice").isInt(),
    body("hit").isBoolean(),
    body("discount").isBoolean(),
    body("inStock").isBoolean(),
    body("urlImages").isArray(),
    authMiddleware,
    (req: Request, res: Response, next: NextFunction) => {
        ProductsController.addProductToBasket(req, res, next);
    },
);

router.post(
    "/addToFavorites",
    body("id").isString(),
    body("title").isString(),
    body("desc").isString(),
    body("characteristic").isString(),
    body("category").isString(),
    body("price").isInt(),
    body("oldPrice").isInt(),
    body("hit").isBoolean(),
    body("discount").isBoolean(),
    body("inStock").isBoolean(),
    body("urlImages").isArray(),
    authMiddleware,
    (req: Request, res: Response, next: NextFunction) => {
        ProductsController.addProductToFavorites(req, res, next);
    },
);

router.post(
    "/registration",
    body("number").isLength({ min: 11, max: 12 }),
    body("password").isLength({ min: 3, max: 32 }),
    body("username").isLength({ min: 3, max: 32 }),
    (req: Request<{}, {}, RegistrationRequestBody>, res: Response, next: NextFunction) => {
        UserController.registration(req, res, next);
    },
);

router.post(
    "/login",
    body("number").isLength({ min: 11, max: 12 }),
    body("password").isLength({ min: 3, max: 32 }),
    (req: Request<{}, {}, LoginRequestBody>, res: Response, next: NextFunction) => {
        UserController.login(req, res, next);
    },
);
router.post("/logout", UserController.logout);

router.post(
    "/addReview",
    authMiddleware,
    body("userId").isString(),
    body("productId").isString(),
    body("star").isInt(),
    body("comment").isObject().optional(),
    body("experience").isString().optional(),
    reviewsController.addReview,
);

// PUT
router.put(
    "/updateUser",
    authMiddleware,
    body("id").isString(),
    body("username").isString().optional(),
    body("number").isString().optional().isLength({ min: 11, max: 12 }),
    body("password").isString().optional().isLength({ min: 3, max: 32 }),
    UserController.updateUser,
);

// DELETE
router.delete(
    "/deleteFromBasket",
    body("id").isString(),
    authMiddleware,
    (req: Request, res: Response, next: NextFunction) => {
        ProductsController.removeProductFromBasket(req, res, next);
    },
);

router.delete(
    "/deleteFromFavorites",
    body("id").isString(),
    authMiddleware,
    (req: Request, res: Response, next: NextFunction) => {
        ProductsController.removeProductFromFavorites(req, res, next);
    },
);

router.delete(
    "/deleteReview",
    authMiddleware,
    body("userId").isString(),
    body("productId").isString(),
    body("reviewId").isString(),
    reviewsController.deleteReview,
);
module.exports = router;
