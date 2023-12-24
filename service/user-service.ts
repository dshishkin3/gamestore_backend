const bcrypt = require("bcrypt");

const UserModel = require("../models/user-model");

import UserDto from "../dtos/user-dto";
import { RegistrationRequestBody } from "../models/types";
import tokenService from "./token-service";

const ApiError = require("../exceptions/api-error");

class UserService {
    async registration(number: string, password: string, username: string): Promise<any> {
        const candidate = await UserModel.findOne({ number });
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с номером ${number} уже существует`);
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const user = await UserModel.create({
            number,
            username,
            favorites: [],
            password: hashPassword,
            basket: [],
        });
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: userDto };
    }

    async login(number: string, password: string): Promise<any> {
        try {
            const user = await UserModel.findOne({ number });
            if (!user) {
                throw ApiError.BadRequest("Пользователь с этим номером не найден");
            }

            const isPassEquals = await bcrypt.compare(password, user.password);
            if (!isPassEquals) {
                throw ApiError.BadRequest("Неверный пароль");
            }

            const userDto = new UserDto(user);
            const tokens = tokenService.generateTokens({ ...userDto });
            await tokenService.saveToken(userDto.id, tokens.refreshToken);
            return { ...tokens, user: userDto };
        } catch (error) {
            throw ApiError.BadRequest("Ошибка при входе пользователя");
        }
    }

    async logout(refreshToken: string) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async update(form: RegistrationRequestBody) {
        if (form.password) {
            form.password = await bcrypt.hash(form.password, 3);
        }

        if (form.username) {
            const candidate = await UserModel.findOne({ username: form.username });
            if (candidate) {
                throw ApiError.BadRequest(`User named ${form.username} already exists`);
            }
        }

        if (form.number) {
            const candidate = await UserModel.findOne({ number: form.number });
            if (candidate) {
                throw ApiError.BadRequest(`User named ${form.number} already exists`);
            }
        }

        await UserModel.findByIdAndUpdate(form.id, {
            $set: form,
        });

        return { username: form?.username, number: form?.number };
    }
}

export default new UserService();
