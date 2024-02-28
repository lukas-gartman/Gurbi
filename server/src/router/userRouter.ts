import express, { Request, Response, Router } from "express";
import { DBUser, userServiceResponse } from "../model/UserModels";
import { UserLogin } from "../model/UserModels";
import { UserService } from "../service/userService";


export function getUserRouter(userService : UserService) : Router{

    const userRouter : Router = express.Router();


    userRouter.post("/register", async(req: Request<{},{},{fullName: string, nickname: string, email: string, password: string, repeatPassword: string}>, res: Response<string>) => {

        try {
            let response : userServiceResponse = await userService.regNewUser(req.body);
            return res.status(response.httpStatusCode).send(response.msg);
        } catch (e: any) {
            res.status(500).send(e.message);
        }

    });

    userRouter.post( "/login", async(req: Request<{},{},{email: string, password: string, rememberMe: boolean}>, res: Response<string>) => {
        try {

           
           
            let response : {token: string, succes: boolean} = await userService.loginUser(req.body);
            console.log(response)
            
            
            return res.status(200).send("d");
            console.log(req.body);
            res.status(200).send("token")

            //const newUser: User = new User("John Doe", "hello@example.com", "password123");
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    }
    );


    return userRouter;

}