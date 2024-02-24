
import express from "express";
import {userRouter} from "./router/user";
import {organisationRouter} from "./router/organisationRouter"
import {authenticationMiddleware} from "./authenticationMiddleware"

export const app = express();

//Router setup
app.use(express.json());

//Add middleware for user token authentication for root /protected
app.use("/authorized", authenticationMiddleware)



//adding routers
app.use("/organisation", organisationRouter)
app.use("/user", userRouter);