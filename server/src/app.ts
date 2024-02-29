
import express, { Application } from "express";
import {getUserRouter} from "./router/userRouter";
import {getOrganisationRouter} from "./router/organisationRouter"
import {authenticationMiddleware} from "./authenticationMiddleware"
import { OrganisationService } from "./service/organisationService";
import cors from 'cors';
import { UserService } from "./service/userService";




export  function getApp(useDatabase: boolean) : Application{
    const app = express();

    //make some request work
    app.use(cors());

    //JSON parse
    app.use(express.json());

    //Add middleware for user token authentication for root /protected
    app.use(/\/.*\/authorized/, authenticationMiddleware)

    //adding routers
    app.use("/organisation", getOrganisationRouter(new OrganisationService(useDatabase)))
    app.use("/user", getUserRouter(new UserService()));

    return app;


}

