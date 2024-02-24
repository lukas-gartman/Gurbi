
import express, { Request, Response, Router } from "express";
import { NewOrganisationData, NewOrganisationDTO } from "../model/organisationModels";
import {ServerModifierResponse, UserIdRequest} from "../model/dataModels";
import {OrganisationService} from "../service/organisationService"


export const organisationRouter : Router = express.Router();

const organisationService : OrganisationService = new OrganisationService();


organisationRouter.post("/new", (req : UserIdRequest<{},{},NewOrganisationDTO>, res : Response<string> ) => {

    try {
        let userId : string = req.userId as string;


        let newOrgData : NewOrganisationData = {orgName : req.body.orgName, creatorNickName : req.body.creatorNickName, creatorId : userId, roles : req.body.roles};
        
        

        let response : ServerModifierResponse = organisationService.addOrganisation(newOrgData);
        return res.status(response.httpStatusCode).send(response.msg);
        

    } catch (e: any) {
        return res.status(500).send(e.message);
    }
});

organisationRouter.post("/delete", (req : UserIdRequest, res : Response<string> ) => {

    try {
        let userId : string = req.userId as string;
        
        let response : ServerModifierResponse = organisationService.deleteOrginsitaion(userId, req.body.organisationId);
        res.status(response.httpStatusCode).send(response.msg);

    } catch (e: any) {
        res.status(500).send(e.message);
    }
});



