import {ServerModifierResponse, Permission} from "../model/dataModels"
import {Event} from "../model/eventModels"

//exempel Permission.getPermission(1)



export class EventService{
    private events : Event[] = [];

    addEvent() : ServerModifierResponse {



        return ServerModifierResponse.GetServerModifierResponse(207)
    }    
}