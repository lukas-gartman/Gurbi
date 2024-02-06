import express, { Request, Response, Router } from "express";
import {UserData} from "../model/dataModels"
import {UserLogin } from "../model/dataModels";

export const UserRouter : Router = express.Router();

//new user register
UserRouter.post( "/register", async(
        req: Request<{}, {}, {}>,
        res: Response<{}>
            ) => {
            try {
                
            } catch (e: any) {
                res.status(500).send(e.message);
            }
    }
);

//maybe update user data
UserRouter.put( "/register", async(
        req: Request<{}, {}, {}>,
        res: Response<{}>
            ) => {
            try {
                
            } catch (e: any) {
                res.status(500).send(e.message);
            }
    }
);


//loggin to get token
UserRouter.get( "/login", async(
        req: Request<{}, {}, {}>,
        res: Response<{}>
            ) => {
            try {
                
            } catch (e: any) {
                res.status(500).send(e.message);
            }
    }
);