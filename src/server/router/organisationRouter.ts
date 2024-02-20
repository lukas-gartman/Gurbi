
import express, { Request, Response, Router } from "express";
import { NewOrganisationData, NewOrganisationDTO } from "../model/organisationModels";
import {ServerModifierResponse} from "../model/dataModels";
import {OrganisationService} from "../service/organisationService"


export const organisationRouter : Router = express.Router();

const organisationService : OrganisationService = new OrganisationService();


organisationRouter.post("/protected/new", (req : Request<{},{},NewOrganisationDTO>, res : Response<ServerModifierResponse> ) => {

    try {
        let userId : string = "e45t34234fwe" /// req.headers['UserId']).name

        let newOrgData : NewOrganisationData = {orgName : req.body.orgName, creatorNickName : req.body.creatorNickName, creatorId : userId, roles : req.body.roles};
        
        

        let response : ServerModifierResponse = organisationService.addOrganisation(newOrgData);

        res.status(200).send(response);

    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

organisationRouter.post("/protected/delete", (req : Request<{},{},{organisationId : string}>, res : Response<ServerModifierResponse> ) => {

    try {
        let userId : string = "e45t34234fwe" /// req.headers['UserId']).name
        

        let response : ServerModifierResponse = organisationService.deleteOrginsitaion(userId, req.body.organisationId);

        res.status(200).send(response);

    } catch (e: any) {
        res.status(500).send(e.message);
    }
});



