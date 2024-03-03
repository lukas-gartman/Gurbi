import { error } from "console";
import {Permission} from "../model/dataModels"
  

export interface Role{
    roleName : string;
    permissions : Permission[];
}

export interface Member{
    userId : string;
    roleName : string;
    nickName : string;
}

export interface Organisation{
    members : Member[];
    roles : Role[];
    name : string;
    id : string;
    picture : string;
}

export interface OrganisationUser{
    userId : string;
    organisationId : string;
}

//convince
export interface NewOrganisationDTO{
    creatorNickName : string;
    orgName : string;
    roles : Role[];
}
export interface NewOrganisationData extends NewOrganisationDTO{
    creatorId : string
}
export class OrgServiceResponse {
    httpStatusCode: number;
    msg: string;
    id: number;

    private constructor(httpStatusCode: number, msg: string, id: number) {
        this.httpStatusCode = httpStatusCode;
        this.msg = msg;
        this.id = id;
    }

    private static readonly serverResponses: OrgServiceResponse[] = [
        { httpStatusCode: 404, msg: "organisation does not exsit", id: 401 },
        { httpStatusCode: 401, msg: "not member in organisation", id: 402 },
        { httpStatusCode: 401, msg: "member does not have permission", id: 403 },
        { httpStatusCode: 409, msg: "user is already member in organisation", id: 404 },
        { httpStatusCode: 409, msg: "nickName is already used in organisation", id: 405 },
        { httpStatusCode: 404, msg: "not an available premission", id: 406 },
        { httpStatusCode: 403, msg: "cant delete this role", id: 407 },
        { httpStatusCode: 404, msg: "role does not exsist in organisation", id: 408 },
        { httpStatusCode: 404, msg: "target member does not exsist in organisation", id: 409 },
        { httpStatusCode: 409, msg: "role already exsists", id: 410 },

        { httpStatusCode: 200, msg: "organistation successfuly added", id: 200 },
        { httpStatusCode: 200, msg: "member does have permission", id: 201 },
        { httpStatusCode: 200, msg: "succesfuly deleted organisation", id: 202 },
        { httpStatusCode: 200, msg: "user added as member to organisation", id: 203 },
        { httpStatusCode: 200, msg: "role added to organisation", id: 204 },
        { httpStatusCode: 200, msg: "role has been deleted from organisation", id: 205 },
        { httpStatusCode: 200, msg: "changed target member's role", id: 206 },
        { httpStatusCode: 200, msg: "added event", id: 207 }
    ];

    static getRes(id: number): OrgServiceResponse {
        let resposne: OrgServiceResponse | undefined = this.serverResponses.find(res => res.id === id);
        if (resposne === undefined) {
            throw error("not know id");
        }
        return new OrgServiceResponse(resposne.httpStatusCode, resposne.msg, resposne.id);
    }

}




