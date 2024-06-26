import express, { Request, Response, Router } from "express";
import { IUserService } from "../service/userService";
import { AuthorizedRequest, ServiceResponse } from "../model/dataModels";
import { IUser } from "../model/UserModels";

export function getUserRouter(userService : IUserService) : Router {
    const userRouter : Router = express.Router();

    userRouter.post("/register", async(req: Request<{},{},{fullName: string, nickname: string, email: string, password: string, repeatPassword: string}>, res: Response<string>) => {
        try {
            let response : ServiceResponse = await userService.regNewUser(req.body);
            return res.status(response.httpStatusCode).send(response.msg);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });

    userRouter.post("/login", async(req: Request<{},{},{email: string, password: string, rememberMe: boolean}>, res: Response<{token: string, succes: boolean, response: ServiceResponse}>) => {
        try {
            let response : {token: string, succes: boolean, response: ServiceResponse} = await userService.loginUser(req.body);
            if (response.succes) {
                return res.status(200).send(response);
            } else {
                return res.status(401).send(response);
            }
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });

    userRouter.post("/authorized/validate", async(req: AuthorizedRequest<{},{},{}>, res: Response<{valid: boolean}>) => {
        res.status(200).json({ valid: true });
    });

    userRouter.get("/:userId", async(req: Request<{userId: number},{},{}>, res: Response<IUser | string>) => {
        const user = await userService.getUser(req.params.userId);
        if (user) {
            res.status(200).send(user);
        } else {
            res.status(404).send("User not found");
        }
    });
  
    userRouter.post("/authorized/profile/settings/update_password", async(req: AuthorizedRequest<{}, {}, { currentPassword: string, newPassword: string, repeatPassword: string}>, res: Response<string>) => {
        try {
            let response: ServiceResponse = await userService.changePassword(req.userId as number, req.body.currentPassword, req.body.newPassword, req.body.repeatPassword);
            return res.status(response.httpStatusCode).send(response.msg);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });

    userRouter.get("/authorized/me", async(req: AuthorizedRequest<{},{},{}>, res: Response<IUser | string>) => {
        const userId = req.userId as number;
        const me = await userService.getUser(userId);
        if (me !== null) {
            res.status(200).send(me);
        } else {
            res.status(404).send("User with ID " + userId + " not found");
        }
    });

    return userRouter;
}
