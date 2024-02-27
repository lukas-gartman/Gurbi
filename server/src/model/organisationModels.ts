//import { conn } from "../db/database";
import TotalCounter, { conn } from "../db/database";
import { organisationModel } from "../db/organisation.db";
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


//convince
export interface NewOrganisationDTO{
    creatorNickName : string;
    orgName : string;
    roles : Role[];
}
export interface NewOrganisationData extends NewOrganisationDTO{
    creatorId : string
}



//MongoDB modell



