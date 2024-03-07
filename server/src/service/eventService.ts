import {OrganisationPermissionChecker, Permission, ServiceResponse} from "../model/dataModels"
import { OrgServiceResponse } from "../model/organisationModels";
import {Event, NewEventDTO} from "../model/eventModels"
import { EventStorage } from "../db/event.db";
import { OrganisationStorage } from "../db/organisation.db";

//exempel Permission.getPermission(1)



export class EventService{

    private eventStorage : EventStorage;
    private orgPremChecker : OrganisationPermissionChecker;

    constructor(eventStorage : EventStorage, orgPremChecker : OrganisationPermissionChecker){
        this.eventStorage = eventStorage;
        this.orgPremChecker = orgPremChecker;
    }


    async addEvent(eventData : NewEventDTO, orgId : string, userId : string) : Promise<ServiceResponse>{

        let checkedUserPremission : {serverRes:ServiceResponse, succes:boolean} = await this.orgPremChecker.memberPermissionCheck(orgId, userId, Permission.getPermission(3))
        if(!checkedUserPremission.succes){
            return checkedUserPremission.serverRes
        }

        let event : Event = eventData as Event;
        event.id = "0";
        event.hostId = orgId;
        event.picture = "no picture"

        try {
            await this.eventStorage.addEvent(event);
        } catch (e : any) {
            return OrgServiceResponse.getRes(400);
        }

        return OrgServiceResponse.getRes(207);

    }

    async getOrganisationEvents(orgId : string) : Promise<Event[]>{
        return await this.eventStorage.getEventsByHostId(orgId);
    }

    async getAllEvents() : Promise<Event[]>{
        return await this.eventStorage.getAllEvents();
    }

    async getEvent(eventId : string) : Promise<Event | null>{
        return await this.eventStorage.getEventById(eventId);
    }


}