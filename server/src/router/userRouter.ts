import express, { Request, Response, Router } from "express";
import { DBUser, userServiceResponse } from "../model/UserModels";
import { UserLogin } from "../model/UserModels";
import { UserService } from "../service/userService";


export function getUserRouter(userService : UserService) : Router{

    const userRouter : Router = express.Router();

    userRouter.post("/register", async(req: Request<{},{},{fullName: string, nickname: string, email: string, password: string, repeatPassword: string}>, res: Response<string>) => {
        try {
            let response : userServiceResponse = await userService.addNewUser(req.body);
            return res.status(response.httpStatusCode).send(response.msg);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });

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

	userRouter.post("/authorized/profile/settings/update_password", async(req: AuthorizedRequest<{}, {}, { currentPassword: string, newPassword: string, repeatPassword: string}>, res: Response<string>) => {
		try {
			let changePasswordSuccess: userServiceResponse = await userService.changePassword(
				req.body.userId,
				req.body.currentPassword,
				req.body.newPassword,
				req.body.repeatPassword);
			return res.status(changePasswordSuccess.httpestatusCode).send(response.msg);
		} catch (e: any) {
			res.status(500).send(e.message);
		}
	};

    return userRouter;

}
