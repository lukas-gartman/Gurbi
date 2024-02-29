import { error } from "console"
import { Request} from "express";

export interface AuthorizedRequest<something = any, ReqBody = any, ResBody = any> extends Request<something, ReqBody ,ResBody> {
    userId?: string;
  }

export class Permission {
    permissionName : string;
    permissionId : number;

    private constructor (permissionName : string, permissionId : number){
        this.permissionId = permissionId;
        this.permissionName = permissionName;
    }

    private static readonly permissions : Permission[] = [
        {permissionName : "ChangeOrginsationName", permissionId : 0},
        {permissionName : "DeleteOrganisation", permissionId : 1},
        {permissionName : "RoleManipulator", permissionId : 2},
        {permissionName : "CreateNewEvent", permissionId : 3},
        {permissionName : "ChangeEventPrice", permissionId : 4},
        {permissionName : "ChangeEventDescription", permissionId : 5},
        {permissionName : "ChangeEventName", permissionId : 6},
        {permissionName : "ChangeEventLocation", permissionId : 7}
    ];
    
    static getPermission(permissionId : number) : Permission{
        let premission : Permission | undefined = this.permissions.find(permission => permission.permissionId === permissionId);
        if(premission === undefined){
            throw error("premission does not exsist");
        }
        return new Permission(premission.permissionName, premission.permissionId);
    }

    static getAllPermissions() : Permission[]{
        let premissions : Permission[] = [];
        this.permissions.forEach(element => {
            premissions.push(new Permission(element.permissionName, element.permissionId));
        });

        return premissions;
    }

  }

