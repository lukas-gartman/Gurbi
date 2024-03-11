import express, { Request, Response, Router } from "express";
import { DBUser, userServiceResponse } from "../model/UserModels";
import { UserLogin } from "../model/UserModels";
import { UserService } from "../service/userService";
import * as jwt from 'jsonwebtoken';
import { MY_NOT_VERY_SECURE_PRIVATE_KEY } from "../app";
import { ServiceResponse } from "../model/dataModels";

export function getUserRouter(userService : UserService) : Router {
    const userRouter : Router = express.Router();

    userRouter.post("/register", async(req: Request<{},{},{fullName: string, nickname: string, email: string, password: string, repeatPassword: string}>, res: Response<string>) => {
        try {
            let response : ServiceResponse = await userService.regNewUser(req.body);
            return res.status(response.httpStatusCode).send(response.msg);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });

    userRouter.post("/login", async(req: Request<{},{},{email: string, password: string, rememberMe: boolean}>, res: Response<{token: string, succes: boolean}>) => {
        try {
            let response : {token: string, succes: boolean} = await userService.loginUser(req.body);
            if (response.succes) {
                return res.status(200).send(response);
            } else {
                return res.status(401).send(response);
            }
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });

    userRouter.post("/validate", async(req: Request<{},{},{token: string}>, res: Response<{valid: boolean, error: string}>) => {
        const token = req.body.token;
        if (!token) {
            res.status(401).json({valid: false, error: "Token not provided" });
        }

        try {
            jwt.verify(token, MY_NOT_VERY_SECURE_PRIVATE_KEY);
            res.status(200).json({ valid: true, error: "" });
        } catch (e) {
            res.status(401).json({ valid: false, error: "Invalid or expired token" });
        }
    });

    return userRouter;
}