

import { Application } from "express";
import {getApp} from "./app"
import { OrganisationService } from "./service/organisationService";
import { MemoryOrganisationStorageHandler } from "./model/organisationModels";

/**
* App Variables
*/
const PORT : number = 8080;

/**
* Server Activation
*/



let app : Application = getApp(true)

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
