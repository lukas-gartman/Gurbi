import {Permission} from "../model/dataModels"
import { OrgServiceResponse } from "../model/organisationModels";
import {Event} from "../model/eventModels"

//exempel Permission.getPermission(1)



export class EventService{
    private events : Event[] = [];

    addEvent() : OrgServiceResponse {



        return OrgServiceResponse.getRes(207)
    }    
}