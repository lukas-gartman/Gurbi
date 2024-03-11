
import express, { Request, Response, Router } from "express";
import { NewOrganisationData, NewOrganisationDTO, Organisation, OrganisationUser, Role } from "../model/organisationModels";
import { AuthorizedRequest, Permission, ServiceResponse } from "../model/dataModels";
import { OrganisationService } from "../service/organisationService"

export function getOrganisationRouter(organisationService : OrganisationService) : Router {
    const organisationRouter : Router = express.Router();

    organisationRouter.post("/authorized/new", async (req : AuthorizedRequest<{},{},NewOrganisationDTO>, res : Response<string>) => {
        try {
            let userId = req.userId as number;
            let newOrgData : NewOrganisationData = {orgName : req.body.orgName, creatorNickName : req.body.creatorNickName, creatorId : userId, roles : req.body.roles};
            let response : ServiceResponse = await organisationService.addOrganisation(newOrgData);
            return res.status(response.httpStatusCode).send(response.msg);
        } catch (e: any) {
            return res.status(500).send(e.message);
        }
    });
    
    organisationRouter.post("/authorized/delete", async (req : AuthorizedRequest<{},{},{organisationId : number}>, res : Response<string>) => {
        try {
            let userId = req.userId as number;
            let response : ServiceResponse = await organisationService.deleteOrganisation(userId, req.body.organisationId);
            return res.status(response.httpStatusCode).send(response.msg);
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
    
    organisationRouter.post("/authorized/role", async (req : AuthorizedRequest<{},{},{userId : number, organisationId : number, role : Role}>, res : Response<string>) => {
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
    
    organisationRouter.put("/authorized/user/role", async (req : AuthorizedRequest<{},{},{userId : number, organisationId : number, targetMemberId : number, roleName : string}>, res : Response<string>) => {
        try {
            let response : ServiceResponse = await organisationService.changeRoleOfMember(req.userId as number, req.body.organisationId, req.body.targetMemberId, req.body.roleName);
            return res.status(response.httpStatusCode).send(response.msg);
        } catch (e: any) {
            return res.status(500).send(e.message);
        }
    });
    
    organisationRouter.post("/authorized/by/user", async (req : AuthorizedRequest<{},{},{}>, res : Response<Organisation[]>) => {
        try {
            let orgs : Organisation[] = await organisationService.getUserOrganisations(req.userId as number);
            return res.status(200).send(orgs);
        } catch (e: any) {
            return res.status(500).send(e.message);
        }
    });
    
    organisationRouter.get("/by/id", async (req : Request<{},{},{organisationId : number}>, res : Response<Organisation>) => {
        try {
            let orgs : Organisation = await organisationService.getOrganisation(req.body.organisationId) as Organisation;
            return res.status(200).send(orgs);
        } catch (e: any) {
            return res.status(500).send(e.message);
        }
    });
    
    organisationRouter.get("/:orgId/permissions/by/user", async (req : AuthorizedRequest<{orgId : number},{},OrganisationUser>, res : Response<Permission[]>) => {
        try {
            const userId = req.userId as number;
            const orgId = req.params.orgId as number;
            const orgUser: OrganisationUser = { userId: userId, organisationId: orgId};
            let permissions : Permission[] = await organisationService.getMemberPermissions(orgUser);
            return res.status(200).send(permissions);
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
 
    return organisationRouter;
}
