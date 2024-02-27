import express, { Request, Response, Router } from "express";
import { User } from "../model/UserModels";
import { UserLogin } from "../model/UserModels";

export const userRouter : Router = express.Router();

userRouter.post( "/", async(
        req: Request<{}, {}, {}>,
        res: Response<string>
    ) => {
        try {
            const newUser: User = new User("John Doe", "hello@example.com", "password123");
        } catch (e: any) {
            res.status(500).send(e.message);
        }
}
);
