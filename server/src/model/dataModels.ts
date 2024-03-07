
import { Request} from "express";
import { Member, OrgServiceResponse, Organisation } from "./organisationModels";
import { OrganisationStorage } from "../db/organisation.db";

export interface AuthorizedRequest<something = any, ReqBody = any, ResBody = any> extends Request<something, ReqBody ,ResBody> {
    userId?: string;
  }


export interface ServiceResponse{
    httpStatusCode : number;
    msg : string;
}

export class Permission {
    permissionName : string;
    permissionId : number;

    private constructor (permissionName : string, permissionId : number){
        this.permissionId = permissionId;
        this.permissionName = permissionName;
    }

    private static readonly permissions : Permission[] = [
        {permissionName : "ChangeOrganisationName", permissionId : 0},
        {permissionName : "DeleteOrganisation", permissionId : 1},
        {permissionName : "RoleManipulator", permissionId : 2},
        {permissionName : "CreateNewEvent", permissionId : 3},
        {permissionName : "ChangeEventPrice", permissionId : 4},
        {permissionName : "ChangeEventDescription", permissionId : 5},
        {permissionName : "ChangeEventName", permissionId : 6},
        {permissionName : "ChangeEventLocation", permissionId : 7}
    ];
    
    static getPermission(permissionId : number) : Permission{
        let permission : Permission | undefined = this.permissions.find(permission => permission.permissionId === permissionId);
        if(permission === undefined){
            throw Error("premission does not exsist");
        }
        return new Permission(permission.permissionName, permission.permissionId);
    }

    static getAllPermissions() : Permission[]{
        let premissions : Permission[] = [];
        this.permissions.forEach(element => {
            premissions.push(new Permission(element.permissionName, element.permissionId));
        });

        return premissions;
    }

}


export class OrganisationPermissionChecker{

    private organisationStorage : OrganisationStorage;

    constructor(organisationStorage : OrganisationStorage){
        this.organisationStorage = organisationStorage;
    }

    async memberPermissionCheck(organisationId : string, userId : string, checkPermission : Permission) : Promise<{ serverRes: ServiceResponse; succes: boolean; }>{
        let organisation : Organisation | null = await this.organisationStorage.getOrganisationById(organisationId);

        if(organisation === null){
            return {serverRes: OrgServiceResponse.getRes(401), succes: false }; 
        }

        let member : Member | undefined = organisation.members.find(member => member.userId === userId);
        if(member === undefined){
            return {serverRes: OrgServiceResponse.getRes(402), succes: false };
        }


        let roleName : string | undefined = organisation?.members.find(member => member.userId === userId)?.roleName;

        let permission : Permission | undefined =  organisation?.roles.find(role => role.roleName === roleName)?.permissions?.find(permission => permission.permissionId === checkPermission.permissionId)
        if(permission === undefined){
            return {serverRes: OrgServiceResponse.getRes(403), succes: false };
        }

        return {serverRes: OrgServiceResponse.getRes(201), succes: true};
    }

}
