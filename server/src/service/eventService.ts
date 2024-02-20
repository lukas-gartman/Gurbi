import {ServerModifierResponse} from "../model/dataModels"
import {Event} from "../model/eventModels"

const permissions : string[] = ["ChangePrice", "ChangeDescription", "ChangeEventName", "ChangeLocation"];


export class EventService{
    private events : Event[] = [];

    addEvent() : ServerModifierResponse {

        return ServerModifierResponse.GetServerModifierResponse(207)
    }    
}