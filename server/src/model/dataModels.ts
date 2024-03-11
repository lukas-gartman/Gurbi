
import { Request} from "express";
import { Member, OrgServiceResponse, Organisation } from "./organisationModels";
import { OrganisationStorage } from "../db/organisation.db";

export interface AuthorizedRequest<something = any, ReqBody = any, ResBody = any> extends Request<something, ReqBody ,ResBody> {
    userId?: number;
}

export interface ServiceResponse {
    httpStatusCode : number;
    msg : string;
}

export enum Permission {
    ChangeOrganisationName = "ChangeOrganisationName",
    DeleteOrganisation = "DeleteOrganisation", 
    RoleManipulator = "RoleManipulator", 
    CreateNewEvent = "CreateNewEvent",
    ChangeEventPrice = "ChangeEventPrice",
    ChangeEventDescription = "ChangeEventDescription",
    ChangeEventName = "ChangeEventName",
    ChangeEventLocation = "ChangeEventLocation",
}

export function getAllPermissions() : Permission[] {
    return Object.values(Permission)
}

export class OrganisationPermissionChecker {
    private organisationStorage : OrganisationStorage;

    constructor(organisationStorage : OrganisationStorage) {
        this.organisationStorage = organisationStorage;
    }

    async memberPermissionCheck(organisationId : number, userId : number, checkPermission : Permission) : Promise<{ serverRes: ServiceResponse; succes: boolean; }> {
        let organisation : Organisation | null = await this.organisationStorage.getOrganisationById(organisationId);
        if (organisation === null) {
            return {serverRes: OrgServiceResponse.getRes(401), succes: false }; 
        }

        let member : Member | undefined = organisation.members.find(member => member.userId === userId);
        if (member === undefined) {
            return {serverRes: OrgServiceResponse.getRes(402), succes: false };
        }

        let roleName : string | undefined = organisation?.members.find(member => member.userId === userId)?.roleName;
        let permission : Permission | undefined = organisation?.roles.find(role => role.roleName === roleName)?.permissions?.find(permission => permission === checkPermission)
        if (permission === undefined) {
            return {serverRes: OrgServiceResponse.getRes(403), succes: false };
        }

        return {serverRes: OrgServiceResponse.getRes(201), succes: true};
    }
}
