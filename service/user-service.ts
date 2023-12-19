const bcrypt = require("bcrypt");

const UserModel = require("../models/user-model");

import UserDto from "../dtos/user-dto";
import ApiError from "../exceptions/api-error";

class UserService {
  async registration(
    number: number,
    password: string,
    username: string
  ): Promise<UserDto> {
    const candidate = await UserModel.findOne({ number });
    if (candidate) {
      throw ApiError.BadRequest(
        `Пользователь с номером ${number} уже существует`
      );
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
    return userDto;
  }

  async login(number: number, password: string): Promise<UserDto> {
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
      return userDto;
    } catch (error) {
      throw ApiError.BadRequest("Ошибка при входе пользователя");
    }
  }
}

export default new UserService();
