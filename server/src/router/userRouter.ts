import express, { Request, Response, Router } from "express";
import { User } from "../model/UserModels";
import { UserLogin } from "../model/UserModels";

export const userRouter : Router = express.Router();

userRouter.post( "/login", async(req: Request, res: Response<string>) => {
    try {

        console.log(req.body);
        res.status(200).send("token")

        //const newUser: User = new User("John Doe", "hello@example.com", "password123");
    } catch (e: any) {
        res.status(500).send(e.message);
    }
}
);
