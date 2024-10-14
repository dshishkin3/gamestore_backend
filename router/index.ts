import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { body, query } from "express-validator";
import UserController from "../controllers/user-controller";
import ProductsController from "../controllers/products-controller";
import { LoginRequestBody, RegistrationRequestBody } from "../models/types";
import reviewsController from "../controllers/reviews-controller";

const Router = require("express").Router;
const router = new Router();

const authMiddleware = require("../middlewares/auth-middleware");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "files/");
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

// POST /api/upload
router.post("/upload", upload.single("file"), (req: Request, res: Response) => {
    console.log("req", req);

    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    res.json({ id: req.file.filename });
});

// GET /api/files/:id
router.get("/files/:id", (req: Request, res: Response) => {
    const fileId = req.params.id;
    const filePath = path.join(__dirname, "..", "files", fileId);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ message: "File not found" });
        }

        res.sendFile(filePath);
    });
});

// GET
router.get("/allProducts", (req: Request, res: Response, next: NextFunction) => {
    ProductsController.getAllProducts(req, res, next);
});

router.get("/getAllSubcategories", (req: Request, res: Response, next: NextFunction) => {
    ProductsController.getAllSubcategories(req, res, next);
});

router.get("/hits", (req: Request, res: Response, next: NextFunction) => {
    ProductsController.getHits(req, res, next);
});

router.get("/categories", (req: Request, res: Response, next: NextFunction) => {
    ProductsController.getCategories(req, res, next);
});

router.get("/category/:title", (req: Request, res: Response, next: NextFunction) => {
    ProductsController.getCategoryByTitle(req, res, next);
});

router.get("/discounts", (req: Request, res: Response, next: NextFunction) => {
    ProductsController.getDiscounts(req, res, next);
});

router.get("/search/:title", (req: Request, res: Response, next: NextFunction) => {
    ProductsController.getSearchItem(req, res, next);
});

router.get("/product/:id", (req: Request, res: Response, next: NextFunction) => {
    ProductsController.getProductById(req, res, next);
});

router.get("/favorites/:userId", (req: Request, res: Response, next: NextFunction) => {
    ProductsController.getFavorites(req, res, next);
});

router.get("/basket/:userId", (req: Request, res: Response, next: NextFunction) => {
    ProductsController.getBasket(req, res, next);
});

router.get(
    "/getProductsBySubcategory/",
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
router.post("/addProduct", (req: Request, res: Response, next: NextFunction) => {
    ProductsController.addProduct(req, res, next);
});

router.post("/getProductsByIds", (req: Request, res: Response, next: NextFunction) => {
    ProductsController.getProductsByIds(req, res, next);
});

router.post(
    "/addToBasket",
    body("id").isString(),
    authMiddleware,
    (req: Request, res: Response, next: NextFunction) => {
        ProductsController.addProductToBasket(req, res, next);
    },
);

router.post(
    "/addToFavorites",
    body("id").isString(),
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

router.put("/editProduct/:id", ProductsController.editProduct);

// DELETE
router.delete("/deleteProduct/:id", (req: Request, res: Response, next: NextFunction) => {
    ProductsController.deleteProduct(req, res, next);
});

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
