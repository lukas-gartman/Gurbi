

import { Application } from "express";
import {getApp} from "./app"
import { OrganisationService } from "./service/organisationService";
import { DBconnHandler } from "./db/database";


/**
* App Variables
*/
const PORT : number = 8080;

/**
* Server Activation
*/


async function startServer(){
    let uri : string = "mongodb://localhost:27017/dat076"
    await DBconnHandler.newConn(uri)
    
    let app : Application = getApp(true)

    app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
    });
}

startServer();


