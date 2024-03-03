
import express, { Application } from "express";
import {getUserRouter} from "./router/userRouter";
import {getOrganisationRouter} from "./router/organisationRouter"
import {authenticationMiddleware} from "./authenticationMiddleware"
import { OrganisationService } from "./service/organisationService";
import cors from 'cors';
import { UserService } from "./service/userService";
import { MemoryOrganisationStorage, MongoDBOrganisationStorage, OrganisationStorage } from "./db/organisation.db";
import { MongoDBUserStorage, UserStorage } from "./db/user.db";


export const MY_NOT_VERY_SECURE_PRIVATE_KEY: string = "AWFSWEGRSTsdsda13123ASFAAadahrrtj";


export  function getApp(useDatabase: boolean) : Application{
    const app = express();

    //make some request work
    app.use(cors());

    //JSON parse
    app.use(express.json());

    //Add middleware for user token authentication for root /authorized
    app.use(/\/.*\/authorized/, authenticationMiddleware)

    //Setting upp service layer
    let organisationStorage : OrganisationStorage;
    let userStorage : UserStorage;
    
    if(useDatabase){
        organisationStorage = new MongoDBOrganisationStorage();
        userStorage = new MongoDBUserStorage();
    }
    else{
        organisationStorage = new MemoryOrganisationStorage()
        throw Error("MemoryOrganisationStorage not implemented")
    }
    

    //adding routers
    app.use("/organisation", getOrganisationRouter(new OrganisationService(organisationStorage)))
    app.use("/user", getUserRouter(new UserService(userStorage)));

    return app;


}

