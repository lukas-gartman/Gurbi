import express, { Request, Response, Router } from "express";
import { NewOrganisationData, NewOrganisationDTO, Organisation, OrganisationUser, Role } from "../model/organisationModels";
import { AuthorizedRequest, Permission, ServiceResponse } from "../model/dataModels";
import { IOrganisationService } from "../service/organisationService"

export function getOrganisationRouter(organisationService : IOrganisationService) : Router {
    const organisationRouter : Router = express.Router();

    organisationRouter.post("/authorized/new", async (req : AuthorizedRequest<{},{},NewOrganisationDTO>, res : Response<{msg: string, orgId: number}>) => {
        try {
            let userId = req.userId as number;
            let newOrgData : NewOrganisationData = {name : req.body.name, creatorNickName : req.body.creatorNickName, creatorId : userId, roles : req.body.roles, description : req.body.description};
            let {response, orgId} : {response: ServiceResponse, orgId?: number | undefined} = await organisationService.addOrganisation(newOrgData);
            return res.status(response.httpStatusCode).send({msg: response.msg, orgId: orgId as number});
        } catch (e: any) {
            return res.status(500).send(e.message);
        }
    });
    
    organisationRouter.delete("/:orgId/authorized", async (req : AuthorizedRequest<{orgId: number},{},{}>, res : Response<string>) => {
        try {
            const orgId = req.params.orgId;
            let userId = req.userId as number;
            let response : ServiceResponse = await organisationService.deleteOrganisation(userId, orgId);
            return res.status(response.httpStatusCode).send(response.msg);
        } catch (e: any) {
            return res.status(500).send(e.message);
        }
    });

    organisationRouter.put("/authorized", async (req : AuthorizedRequest<{},{},Organisation>, res : Response<string[]>) => {
        try {
            console.log("The body is\n\n" + req.body.name)
            const response = await organisationService.updateOrganisation(req.body, req.userId as number);
            if (response.length === 1) {
                return res.status(response[0].httpStatusCode).send([response[0].msg]);
            } else {
                return res.status(response[0].httpStatusCode).send(response.map(r => r.msg)); // Assuming that multiple messages = same error status code
            }
        } catch (e: any) {
            return res.status(500).send(e.message);
        }
    });
    
    organisationRouter.post("/authorized/user", async (req : AuthorizedRequest<{},{},{nickName : string, organisationId : number}>, res : Response<string>) => {
        try {
            let userId = req.userId as number;
            let response : ServiceResponse = await organisationService.addMemberToOrganisation(userId, req.body.nickName,req.body.organisationId);
            return res.status(response.httpStatusCode).send(response.msg);
        } catch (e: any) {
            return res.status(500).send(e.message);
        }
    });
    
    organisationRouter.delete("/:orgId/authorized/user", async (req : AuthorizedRequest<{orgId : number},{},{}>, res : Response<string> ) => {
        try {
            let userId = req.userId as number;
            let orgId = req.params.orgId;

            let response : ServiceResponse = await organisationService.removeMemberFromOrganisation(userId, orgId);
            return res.status(response.httpStatusCode).send(response.msg);
        } catch (e: any) {
            return res.status(500).send(e.message);
        }
    });
    
    organisationRouter.post("/authorized/role", async (req : AuthorizedRequest<{},{},{organisationId : number, role : Role}>, res : Response<string>) => {
        try {
            let response : ServiceResponse = await organisationService.addRoleToOrganisation(req.userId as number, req.body.organisationId, req.body.role);
            return res.status(response.httpStatusCode).send(response.msg);
        } catch (e: any) {
            return res.status(500).send(e.message);
        }
    });
    
    organisationRouter.delete("/authorized/role", async (req : AuthorizedRequest<{},{},{organisationId : number, roleName : string}>, res : Response<string>) => {
        try {
            let response : ServiceResponse = await organisationService.deleteRoleFromOrganistation(req.userId as number, req.body.organisationId, req.body.roleName);
            return res.status(response.httpStatusCode).send(response.msg);
        } catch (e: any) {
            return res.status(500).send(e.message);
        }
    });
  
    organisationRouter.put("/authorized/user/role", async (req : AuthorizedRequest<{},{},{organisationId : number, targetMemberId : number, roleName : string}>, res : Response<string>) => {
        try {
            let response : ServiceResponse = await organisationService.changeRoleOfMember(req.userId as number, req.body.organisationId, req.body.targetMemberId, req.body.roleName);
            return res.status(response.httpStatusCode).send(response.msg);
        } catch (e: any) {
            return res.status(500).send(e.message);
        }
    });
    
    organisationRouter.get("/authorized/by/user", async (req : AuthorizedRequest<{},{},{}>, res : Response<Organisation[]>) => {
        try {
            let orgs : Organisation[] = await organisationService.getUserOrganisations(req.userId as number);
            return res.status(200).send(orgs);
        } catch (e: any) {
            return res.status(500).send(e.message);
        }
    });
    

    organisationRouter.get("/all", async (req: Request<{},{},{}>, res: Response<Organisation[]>) => {
        try {
            let orgs: Organisation[] = await organisationService.getOrganisations() as Organisation[];
            return res.status(200).send(orgs);
        } catch (e: any) {
            return res.status(500).send(e.message);
        }
    });

    organisationRouter.get("/:orgId", async (req : Request<{orgId : number},{},{}>, res : Response<Organisation>) => {
        try {
            let orgs : Organisation = await organisationService.getOrganisation(req.params.orgId as number) as Organisation;
            return res.status(200).send(orgs);
        } catch (e: any) {
            return res.status(500).send(e.message);
        }
    });
    
    organisationRouter.get("/:orgId/user/:userId/permissions", async (req : Request<{orgId : number, userId : number},{},{}>, res : Response<Permission[]>) => {
        try {
            let userId = req.params.userId as number;
            let orgId = req.params.orgId as number;
            let orgUser: OrganisationUser = { userId: userId, organisationId: orgId};
            let permissions : Permission[] = await organisationService.getMemberPermissions(orgUser);
            return res.status(200).send(permissions);
        } catch (e: any) {
            return res.status(500).send(e.message);
        }
    });
 
    return organisationRouter;
}
