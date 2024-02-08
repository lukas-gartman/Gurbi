import express, { Request, Response, Router } from "express";
import {UserData} from "../model/dataModels"
import {UserLogin } from "../model/dataModels";

export const userRouter : Router = express.Router();

UserRegistartionRouter.post( "/", async(
        req: Request<{ id: string }, {}, { done: boolean }>,
        res: Response<string>
    ) => {
        try {
            newsUser: UserData = new UserData("1234", "John Doe", "hello@example.com", "password123", "salt1234", new Date());
        } catch (e: any) {
            res.status(500).send(e.message);
        }
}
);
