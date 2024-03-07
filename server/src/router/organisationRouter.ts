
import express, { Request, Response, Router } from "express";
import { NewOrganisationData, NewOrganisationDTO, Organisation, OrganisationUser, Role} from "../model/organisationModels";
import { Event} from "../model/eventModels";
import {AuthorizedRequest, Permission} from "../model/dataModels";
import { OrgServiceResponse } from "../model/organisationModels";
import {OrganisationService} from "../service/organisationService"
import { log } from "console";
import { NewEventDTO } from "../model/eventModels";
import e from "express";


export function getOrganisationRouter(organisationService : OrganisationService) : Router{

    const organisationRouter : Router = express.Router();

    organisationRouter.post("/authorized/new", async (req : AuthorizedRequest<{},{},NewOrganisationDTO>, res : Response<string> ) => {
    
        try {
            let userId : string = req.userId as string;
    
            let newOrgData : NewOrganisationData = {orgName : req.body.orgName, creatorNickName : req.body.creatorNickName, creatorId : userId, roles : req.body.roles};
            
    
            let response : OrgServiceResponse = await organisationService.addOrganisation(newOrgData);
            return res.status(response.httpStatusCode).send(response.msg);
            
    
        } catch (e: any) {
            return res.status(500).send(e.message);
        }
    });
    
    organisationRouter.post("/authorized/delete", async (req : AuthorizedRequest<{},{},{organisationId : string}>, res : Response<string> ) => {
    
        try {
            let userId : string = req.userId as string;
            
            let response : OrgServiceResponse = await organisationService.deleteOrganisation(userId, req.body.organisationId);
            
            return res.status(response.httpStatusCode).send(response.msg);
    
        } catch (e: any) {
            return res.status(500).send(e.message);
        }
    });
    
    
    organisationRouter.post("/authorized/user", async (req : AuthorizedRequest<{},{},{nickName : string, organisationId : string}>, res : Response<string> ) => {
        try {
            let userId : string = req.userId as string;
            
            let response : OrgServiceResponse = await organisationService.addMemberToOrganisation(userId, req.body.nickName,req.body.organisationId);
            return res.status(response.httpStatusCode).send(response.msg);
    
    
        } catch (e: any) {
            return res.status(500).send(e.message);
        }
    
    
    })
    
    
    organisationRouter.post("/authorized/role", async (req : AuthorizedRequest<{},{},{userId : string, organisationId : string, role : Role}>, res : Response<string> ) => {
        try {
            let response : OrgServiceResponse = await organisationService.addRoleToOrganisation(req.userId as string, req.body.organisationId, req.body.role);
            return res.status(response.httpStatusCode).send(response.msg);
            
        } catch (e: any) {
            return res.status(500).send(e.message);
        }
    
    });
    
    
    organisationRouter.delete("/authorized/role", async (req : AuthorizedRequest<{},{},{organisationId : string, roleName : string}>, res : Response<string> ) => {
    
        try {
            let response : OrgServiceResponse = await organisationService.deleteRoleFromOrganistation(req.userId as string, req.body.organisationId, req.body.roleName);
            return res.status(response.httpStatusCode).send(response.msg);
            
        } catch (e: any) {
            return res.status(500).send(e.message);
        }
    
    });
    
    
    
    organisationRouter.put("/authorized/user/role", async (req : AuthorizedRequest<{},{},{userId : string, organisationId : string, targetMemberId : string, roleName : string}>, res : Response<string> ) => {
        try {
            let response : OrgServiceResponse = await organisationService.changeRoleOfMember(req.userId as string, req.body.organisationId, req.body.targetMemberId, req.body.roleName);
            return res.status(response.httpStatusCode).send(response.msg);
        } catch (e: any) {
            return res.status(500).send(e.message);
        }
    
    });
    
    
    organisationRouter.get("/authorized/by/user", async (req : AuthorizedRequest<{},{},{}>, res : Response<Organisation[]> ) => {
        try {
    
            let orgs : Organisation[] = await organisationService.getUserOrganisations(req.userId as string);
            return res.status(200).send(orgs);
            
        } catch (e: any) {
            return res.status(500).send(e.message);
        }
    });
    
    organisationRouter.get("/by/id", async (req : Request<{},{},{organisationId : string}>, res : Response<Organisation> ) => {
        try {
            let orgs : Organisation = await organisationService.getOrganisation(req.body.organisationId) as Organisation;
            return res.status(200).send(orgs);
            
        } catch (e: any) {
            return res.status(500).send(e.message);
        }
    });
    
    organisationRouter.get("/:orgId/permissions/by/user", async (req : AuthorizedRequest<{orgId : string},{},OrganisationUser>, res : Response<Permission[] >)  => {
        try {
            let orgId : string = req.params.orgId.toString()

            const orgUser: OrganisationUser = { userId: req.userId as string, organisationId: orgId};
            let permissions : Permission[] = await organisationService.getMemberPermissions(orgUser);

            return res.status(200).send(permissions);
        } catch (e: any) {
            return res.status(500).send(e.message);
        }

    });

    organisationRouter.post("/:orgId/authorized/event", async (req : AuthorizedRequest<{orgId : string},{}, NewEventDTO>, res : Response<string>)  => {
        try {
            let orgId : string = req.params.orgId.toString()
        
            let response : OrgServiceResponse = await organisationService.addEvent(req.body, orgId, req.userId as string)
            return res.status(response.httpStatusCode).send(response.msg);

        } catch (e: any) {
            return res.status(500).send(e.message);
        }
    });


    organisationRouter.get("/:orgId/events", async (req: Request<{orgId : string},{},{}>, res : Response<{}>) => {
        try {
            let orgId : string = req.params.orgId.toString();
            let response : Event[] = await organisationService.getOrganisationEvents(orgId);
            return res.status(200).send(response);
            
            
        } catch (e : any) {
            return res.status(500).send(e.message);
        }
    })

    return organisationRouter;
}




