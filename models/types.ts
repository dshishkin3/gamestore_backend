// Types

import { ObjectId } from "mongoose";

export type RegistrationRequestBody = {
    id?: string;
    number: string;
    password: string;
    username: string;
};

export type LoginRequestBody = {
    number: string;
    password: string;
};

export type ProductType = {
    id: string;
    title: string;
    desc: string;
    characteristic: string;
    category: string;
    price: number;
    oldPrice: number;
    hit: boolean;
    discount: boolean;
    inStock: boolean;
    urlImages: string[];
};

export type ReviewTypeBody = {
    id: string;
    userId: string;
    productId: string;
    star: number;
    comment: {
        advantages: string;
        flaws: string;
        comment: string;
    };
    experience: experience;
};

type experience = "month" | "fewMonth" | "moreYear";
