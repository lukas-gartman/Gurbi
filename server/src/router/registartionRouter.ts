import express, { Request, Response, Router } from "express";
import {UserData} from "../model/dataModels"
import {UserLogin } from "../model/dataModels";

export const UserRegistartionRouter : Router = express.Router();

UserRegistartionRouter.get( "/", async(
    req: Request<{}, {}, {}>,
    res: Response<string>
        ) => {
        try {
            res.status(200).send("works");
        } catch (e: any) {
            res.status(500).send(e.message);
        }
}


);