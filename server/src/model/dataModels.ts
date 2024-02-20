import { error } from "console"


export class ServerModifierResponse{
    successState : boolean;
    msg : string;
    serverModifierResponseId : number;

    private constructor(successState : boolean, msg : string, serverModifierResponseId : number){
        this.successState = successState;
        this.msg = msg;
        this.serverModifierResponseId = serverModifierResponseId;
    }

    private static readonly serverResponses : ServerModifierResponse[] = [
        {successState: false, msg : "organisation does not exsit", serverModifierResponseId : 401},
        {successState : false, msg: "not member in organisation", serverModifierResponseId : 402},
        {successState : false, msg : "member does not have permission", serverModifierResponseId : 403},
        {successState: false, msg : "user is already member in organisation", serverModifierResponseId : 404},
        {successState: false, msg : "nickName is already used in organisation", serverModifierResponseId : 405},
        {successState : false, msg: "not an available premission", serverModifierResponseId : 406},
        {successState : false, msg : "cant delete this role", serverModifierResponseId : 407},
        {successState : false, msg : "role does not exsist in organisation", serverModifierResponseId : 408},
        {successState : false, msg : "target member does not exsist in organisation", serverModifierResponseId : 409},
        
        {successState : true, msg : "organistation successfuly added", serverModifierResponseId : 200},
        {successState : true, msg : "member does have permission", serverModifierResponseId : 201},
        {successState : true, msg : "succesfuly deleted organisation", serverModifierResponseId : 202},
        {successState: true, msg : "user added as member to organisation", serverModifierResponseId: 203},
        {successState : true, msg: "role added to organisation", serverModifierResponseId : 204},
        {successState : true, msg : "role has been deleted from organisation", serverModifierResponseId : 205},
        {successState : true, msg : "changed target member's role", serverModifierResponseId : 206},
        {successState : true, msg : "added event", serverModifierResponseId : 207}
    ]

    static GetServerModifierResponse(serverModifierResponseId : number) : ServerModifierResponse{
        let resposne : ServerModifierResponse | undefined = this.serverResponses.find(res => res.serverModifierResponseId === serverModifierResponseId)
        if(resposne === undefined){
            throw error("not know serverModifierResponseId");
        }
        return new ServerModifierResponse(resposne.successState, resposne.msg, resposne.serverModifierResponseId);
    }

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
        {permissionName : "ChangeLocation", permissionId : 7}
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

export class User {
    public id : string
    private name : string
    private password : string
    private salt : string
    private email : string
    private regDate : Date

    constructor(name: string, email: string, password: string, ) {
	this.id = "id1234";
	this.salt = "salt1234"; 
	this.regDate = new Date();

	this.name = name;
	this.email = email;
	this.password = password;
    }
}

export interface UserLogin{
    email : string
    password : string
}


