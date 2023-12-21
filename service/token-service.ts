import jwt from "jsonwebtoken";
import { Schema, model, Document, Model } from "mongoose";
import UserDto from "../dtos/user-dto";

const TokenModel = require("../models/token-model");

export interface TokenDocument extends Document {
  user: string;
  refreshToken: string;
}

class TokenService {
  generateTokens(payload: UserDto) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
      expiresIn: "30m",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: "30d",
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  validateAccessToken(token: string) {
    console.log("token:", token);

    try {
      const userData = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET!
      ) as UserDto;
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token: string) {
    try {
      const userData = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET!
      ) as UserDto;
      return userData;
    } catch (e) {
      return null;
    }
  }

  async saveToken(userId: string, refreshToken: string) {
    const tokenData = await TokenModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await TokenModel.create({ user: userId, refreshToken });
    return token;
  }

  async removeToken(refreshToken: string) {
    const tokenData = await TokenModel.deleteOne({ refreshToken });
    return tokenData;
  }

  async findToken(refreshToken: string) {
    const tokenData = await TokenModel.findOne({ refreshToken });
    return tokenData;
  }
}

export default new TokenService();
