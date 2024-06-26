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
    banner : string;
    description : string;
}

export interface OrganisationUser {
    userId : number;
    organisationId : number;
}

//convince
export interface NewOrganisationDTO {
    creatorNickName : string;
    name : string;
    description : string;
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
        { httpStatusCode: 400, msg: "Please fill in all required fields.", id: 400 },
        { httpStatusCode: 404, msg: "The organisation does not exist.", id: 401 },
        { httpStatusCode: 401, msg: "You are not a member of the organisation.", id: 402 },
        { httpStatusCode: 401, msg: "You do not have permission to do that.", id: 403 },
        { httpStatusCode: 409, msg: "You are already a member of the organisation.", id: 404 },
        { httpStatusCode: 409, msg: "Your nickname is already taken in this organisation.", id: 405 },
        { httpStatusCode: 404, msg: "not an available permission", id: 406 },
        { httpStatusCode: 403, msg: "You cannot delete this role.", id: 407 },
        { httpStatusCode: 404, msg: "The role does not exist in the organisation.", id: 408 },
        { httpStatusCode: 404, msg: "The member does not exist in the organisation.", id: 409 },
        { httpStatusCode: 409, msg: "The role already exists.", id: 410 },
        { httpStatusCode: 403, msg: "There must be at least one admin left in the organisation.", id: 411 },
        { httpStatusCode: 403, msg: "You must be an admin to change the role of a member to/from admin.", id: 412 },
        { httpStatusCode: 400, msg: "Unknown error :(", id: 413 },

        { httpStatusCode: 200, msg: "Organisatation successfully added!", id: 200 },
        { httpStatusCode: 200, msg: "You do not have permission for that.", id: 201 },
        { httpStatusCode: 200, msg: "Succesfully deleted organisation!", id: 202 },
        { httpStatusCode: 200, msg: "Joined organisation!", id: 203 },
        { httpStatusCode: 200, msg: "The role has been added to the organisation.", id: 204 },
        { httpStatusCode: 200, msg: "The role has been deleted from the organisation.", id: 205 },
        { httpStatusCode: 200, msg: "changed target member's role", id: 206 },
        { httpStatusCode: 200, msg: "Left organisation!", id: 207 },
        { httpStatusCode: 200, msg: "Organisatation has been updated!", id: 208 },
    ];

    static getResponse(id: number): OrgServiceResponse {
        let response: OrgServiceResponse | undefined = this.serverResponses.find(res => res.id === id);
        if (response === undefined) {
            throw error("unknown id");
        }
        return new OrgServiceResponse(response.httpStatusCode, response.msg, response.id);
    }
}
