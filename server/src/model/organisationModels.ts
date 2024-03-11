import { error } from "console";
import { Permission, ServiceResponse } from "../model/dataModels"

export interface Role{
    roleName : string;
    permissions : Permission[];
}

export interface Member {
    userId : number;
    roleName : string;
    nickName : string;
}

export interface Organisation {
    id : number;
    members : Member[];
    roles : Role[];
    name : string;
    picture : string;
}

export interface OrganisationUser {
    userId : number;
    organisationId : number;
}

//convince
export interface NewOrganisationDTO {
    creatorNickName : string;
    orgName : string;
    roles : Role[];
}

export interface NewOrganisationData extends NewOrganisationDTO {
    creatorId : number
}

export class OrgServiceResponse implements ServiceResponse {
    httpStatusCode: number;
    msg: string;
    id: number;

    private constructor(httpStatusCode: number, msg: string, id: number) {
        this.httpStatusCode = httpStatusCode;
        this.msg = msg;
        this.id = id;
    }

    private static readonly serverResponses: OrgServiceResponse[] = [
        { httpStatusCode: 400, msg: "missing data", id: 400 },
        { httpStatusCode: 404, msg: "organisation does not exist", id: 401 },
        { httpStatusCode: 401, msg: "not a member of organisation", id: 402 },
        { httpStatusCode: 401, msg: "member does not have permission", id: 403 },
        { httpStatusCode: 409, msg: "user is already member of organisation", id: 404 },
        { httpStatusCode: 409, msg: "nickName is already used in organisation", id: 405 },
        { httpStatusCode: 404, msg: "not an available permission", id: 406 },
        { httpStatusCode: 403, msg: "cannot delete this role", id: 407 },
        { httpStatusCode: 404, msg: "role does not exist in organisation", id: 408 },
        { httpStatusCode: 404, msg: "target member does not exist in organisation", id: 409 },
        { httpStatusCode: 409, msg: "role already exists", id: 410 },

        { httpStatusCode: 200, msg: "organistation successfully added", id: 200 },
        { httpStatusCode: 200, msg: "member does have permission", id: 201 },
        { httpStatusCode: 200, msg: "succesfully deleted organisation", id: 202 },
        { httpStatusCode: 200, msg: "user added as member to organisation", id: 203 },
        { httpStatusCode: 200, msg: "role added to organisation", id: 204 },
        { httpStatusCode: 200, msg: "role has been deleted from organisation", id: 205 },
        { httpStatusCode: 200, msg: "changed target member's role", id: 206 },
    ];

    static getRes(id: number): OrgServiceResponse {
        let resposne: OrgServiceResponse | undefined = this.serverResponses.find(res => res.id === id);
        if (resposne === undefined) {
            throw error("unknown id");
        }
        return new OrgServiceResponse(resposne.httpStatusCode, resposne.msg, resposne.id);
    }
}
