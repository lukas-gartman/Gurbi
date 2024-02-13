import express, { Request, Response, Router } from "express";
import { User } from "../model/dataModels";
import { UserLogin } from "../model/dataModels";

export const userRouter : Router = express.Router();

userRouter.post( "/", async(
        req: Request<{}, {}, {name: string, email: string, password: string}>,
        res: Response<string>
    ) => {
        try {
            const newUser: User = new User(req.body.name, req.body.email, req.body.password);
            res.status(200).send(newUser);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
}
);
