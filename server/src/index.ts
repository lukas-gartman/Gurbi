

import { Application } from "express";
import {getApp} from "./app"
import { DBconnHandler } from "./db/database";


/**
* App Variables
*/
const PORT : number = 8080;
const USE_DATABASE : boolean = true;
const DATABASE_URI : string = "mongodb://localhost:27017/dat076"
/**
* Server Activation
*/


async function startServer(){
    if(USE_DATABASE){
        await DBconnHandler.newConn(DATABASE_URI)
    }
    
    let app : Application = getApp(USE_DATABASE)

    app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
    });
}

startServer();


