
import express, { Application } from "express";
import {userRouter} from "./router/user";
import {getOrganisationRouter} from "./router/organisationRouter"
import {authenticationMiddleware} from "./authenticationMiddleware"
import { OrganisationService } from "./service/organisationService";





export function getApp(useDatabase: boolean) : Application{


    const app = express();

    //Router setup
    app.use(express.json());

    //Add middleware for user token authentication for root /protected
    app.use("/authorized", authenticationMiddleware)



    //adding routers
    app.use("/organisation", getOrganisationRouter(new OrganisationService(useDatabase)))
    app.use("/user", userRouter);

    return app;


}

