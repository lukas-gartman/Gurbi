import { error } from "console"

export interface Event{
    id : string
    name : string
    location : string
    description : string
    dateTime : Date
}

interface ServerModifierResponseTemplate{
    successState : boolean;
    msg : string;
    serverModifierResponseId : number;
}


export class ServerModifierResponse{
    successState : boolean;
    msg : string;
    serverModifierResponseId : number;

    private constructor(successState : boolean, msg : string, serverModifierResponseId : number){
        this.successState = successState;
        this.msg = msg;
        this.serverModifierResponseId = serverModifierResponseId;
    }

    private static readonly serverResponses : ServerModifierResponseTemplate[] = [
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
        {successState : true, msg : "changed target member's role", serverModifierResponseId : 206}
    ]

    static GetServerModifierResponse(serverModifierResponseId : number) : ServerModifierResponse{
        let resposne : ServerModifierResponseTemplate | undefined = this.serverResponses.find(res => res.serverModifierResponseId === serverModifierResponseId)
        if(resposne === undefined){
            throw error("not know serverModifierResponseId");
        }
        return new ServerModifierResponse(resposne.successState, resposne.msg, resposne.serverModifierResponseId);
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


