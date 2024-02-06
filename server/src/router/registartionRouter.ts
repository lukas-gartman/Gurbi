import express, { Request, Response, Router } from "express";
import {UserData} from "../model/dataModels"
import {UserLogin } from "../model/dataModels";

export const UserRegistartionRouter : Router = express.Router();

UserRegistartionRouter.post( "/", async(
    req: Request<{ id: string }, {}, { done: boolean }>,
    res: Response<string>
        ) => {
        try {
           

        } catch (e: any) {
            res.status(500).send(e.message);
        }
}


);