
import express, { Request, Response, Router } from "express";
import { NewOrganisation, NewOrganisationDTO } from "../model/organisationModels";
import {OrganisationService} from "../service/organisationService"


export const organisationRouter : Router = express.Router();

const organisationService : OrganisationService = new OrganisationService();


organisationRouter.post("/protected/new", (req : Request<{},{},NewOrganisationDTO>, res : Response<{}> ) => {

    try {
        
        
        let userId : string = "e45t34234fwe" /// req.headers['UserId']).name

        let newOrgData : NewOrganisation = {orgName : req.body.orgName, creatorNickName : req.body.creatorNickName, creatorId : userId, roles : req.body.roles};
        
        organisationService.addOrganisation(newOrgData);

        res.status(200).send();

    } catch (e: any) {
        res.status(500).send(e.message);
    }
});


