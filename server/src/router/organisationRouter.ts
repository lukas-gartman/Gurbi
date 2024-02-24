
import express, { Request, Response, Router } from "express";
import { NewOrganisationData, NewOrganisationDTO, Organisation, Role} from "../model/organisationModels";
import {ServerModifierResponse, AuthorizedRequest} from "../model/dataModels";
import {OrganisationService} from "../service/organisationService"


export const organisationRouter : Router = express.Router();

const organisationService : OrganisationService = new OrganisationService();


organisationRouter.post("/authorized/new", (req : AuthorizedRequest<{},{},NewOrganisationDTO>, res : Response<string> ) => {

    try {
        let userId : string = req.userId as string;


        let newOrgData : NewOrganisationData = {orgName : req.body.orgName, creatorNickName : req.body.creatorNickName, creatorId : userId, roles : req.body.roles};
        
        

        let response : ServerModifierResponse = organisationService.addOrganisation(newOrgData);
        return res.status(response.httpStatusCode).send(response.msg);
        

    } catch (e: any) {
        return res.status(500).send(e.message);
    }
});

organisationRouter.post("/authorized/delete", (req : AuthorizedRequest<{},{},{organisationId : string}>, res : Response<string> ) => {

    try {
        let userId : string = req.userId as string;
        
        let response : ServerModifierResponse = organisationService.deleteOrginsitaion(userId, req.body.organisationId);
        
        return res.status(response.httpStatusCode).send(response.msg);

    } catch (e: any) {
        return res.status(500).send(e.message);
    }
});


organisationRouter.post("/authorized/user", (req : AuthorizedRequest<{},{},{nickName : string, organisationId : string}>, res : Response<string> ) => {
    try {
        let userId : string = req.userId as string;
        
        let response : ServerModifierResponse = organisationService.addMemberToOrganisation(userId, req.body.nickName,req.body.organisationId);
        return res.status(response.httpStatusCode).send(response.msg);


    } catch (e: any) {
        return res.status(500).send(e.message);
    }


})


organisationRouter.post("/authorized/role", (req : AuthorizedRequest<{},{},{userId : string, organisationId : string, role : Role}>, res : Response<string> ) => {
    try {
        let response : ServerModifierResponse = organisationService.addRoleToOrganisation(req.userId as string, req.body.organisationId, req.body.role);
        return res.status(response.httpStatusCode).send(response.msg);
        
    } catch (e: any) {
        return res.status(500).send(e.message);
    }

});


organisationRouter.delete("/authorized/role", (req : AuthorizedRequest<{},{},{organisationId : string, roleName : string}>, res : Response<string> ) => {

    try {
        let response : ServerModifierResponse = organisationService.deleteRoleFromOrganistation(req.userId as string, req.body.organisationId, req.body.roleName);
        return res.status(response.httpStatusCode).send(response.msg);
        
    } catch (e: any) {
        return res.status(500).send(e.message);
    }

});



organisationRouter.put("/authorized/user/role", (req : AuthorizedRequest<{},{},{userId : string, organisationId : string, targetMemberId : string, roleName : string}>, res : Response<string> ) => {
    try {
        let response : ServerModifierResponse = organisationService.changeRoleOfMember(req.userId as string, req.body.organisationId, req.body.targetMemberId, req.body.roleName);
        return res.status(response.httpStatusCode).send(response.msg);
    } catch (e: any) {
        return res.status(500).send(e.message);
    }

});


organisationRouter.get("/authorized/by/user", (req : AuthorizedRequest<{},{},{}>, res : Response<Organisation[]> ) => {
    try {

        let orgs : Organisation[] = organisationService.getUserOrganisations(req.userId as string);
        return res.status(200).send(orgs);
        
    } catch (e: any) {
        return res.status(500).send(e.message);
    }
});



