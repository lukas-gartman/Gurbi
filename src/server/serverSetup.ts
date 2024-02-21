
import express from "express";
import {userRouter} from "./router/user";
import {organisationRouter} from "./router/organisationRouter"

export const app = express();

//Router setup
app.use(express.json());

//Add middleware for user token authentication for root /protected

//adding routers
app.use("/organisation", organisationRouter)
app.use("/user", userRouter);