import {OrganisationPermissionChecker, Permission, ServiceResponse} from "../model/dataModels"
import {Event, EventServiceResponse, NewEventDTO} from "../model/eventModels"
import { EventStorage } from "../db/event.db";

//exempel Permission.getPermission(1)



export class EventService{

    private eventStorage : EventStorage;
    private orgPremChecker : OrganisationPermissionChecker;

    constructor(eventStorage : EventStorage, orgPremChecker : OrganisationPermissionChecker){
        this.eventStorage = eventStorage;
        this.orgPremChecker = orgPremChecker;
    }


    async addEvent(eventData : NewEventDTO, orgId : string, userId : string) : Promise<ServiceResponse>{

        let checkedUserPremission : {serverRes:ServiceResponse, succes:boolean} = await this.orgPremChecker.memberPermissionCheck(orgId, userId, Permission.CreateNewEvent)
        if(!checkedUserPremission.succes){
            return checkedUserPremission.serverRes
        }

        let event : Event = eventData as Event;
        event.id = "0";
        event.hostId = orgId;

        try {
            await this.eventStorage.addEvent(event);
        } catch (e : any) {
            return EventServiceResponse.getRes(0);
        }

        return EventServiceResponse.getRes(1);

    }

    async getOrganisationEvents(orgId : string) : Promise<Event[]>{
        return await this.eventStorage.getEventsByHostId(orgId);
    }

    async getEventsByOrganisations(orgIds : string[]) : Promise<Event[]> {
        const promises: Promise<Event[]>[] = orgIds.map(orgId => this.eventStorage.getEventsByHostId(orgId));
        const events = await Promise.all(promises);
        return events.flat().sort((a: Event, b: Event) => {
            return a.date.getTime() - b.date.getTime();
        });
    }

    async getAllEvents() : Promise<Event[]>{
        return await this.eventStorage.getAllEvents();
    }

    async getEvent(eventId : string) : Promise<Event | undefined>{
        let event : Event | null | undefined = await this.eventStorage.getEventById(eventId)

        if (event === null){
            event = undefined;
        }

        return event;
    }


}