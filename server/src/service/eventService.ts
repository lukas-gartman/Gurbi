import {OrganisationPermissionChecker, Permission, ServiceResponse} from "../model/dataModels"
import {Event, EventServiceResponse, NewEventDTO} from "../model/eventModels"
import { EventStorage } from "../db/event.db";

export interface IEventService {
    addEvent(eventData : NewEventDTO, orgId : number, userId : number) : Promise<ServiceResponse>;
    getOrganisationEvents(orgId : number) : Promise<Event[]>;
    getAllEvents() : Promise<Event[]>;
    getEvent(eventId : number) : Promise<Event | undefined>;
    getEventsByOrganisations(orgIds: number[]): Promise<Event[]>;
}

export class EventService implements IEventService {
    private eventStorage : EventStorage;
    private orgPremChecker : OrganisationPermissionChecker;

    constructor(eventStorage : EventStorage, orgPremChecker : OrganisationPermissionChecker) {
        this.eventStorage = eventStorage;
        this.orgPremChecker = orgPremChecker;
    }

    async addEvent(eventData : NewEventDTO, orgId : number, userId : number) : Promise<ServiceResponse> {
        let checkedUserPremission : {serverRes:ServiceResponse, succes:boolean} = await this.orgPremChecker.memberPermissionCheck(orgId, userId, Permission.CreateNewEvent)
        if (!checkedUserPremission.succes) {
            return checkedUserPremission.serverRes
        }

        let event : Event = eventData as Event;
        event.id = 0;
        event.hostId = orgId;

        try {
            await this.eventStorage.addEvent(event);
        } catch (e : any) {
            return EventServiceResponse.getResponse(0);
        }

        return EventServiceResponse.getResponse(1);
    }

    async getOrganisationEvents(orgId : number) : Promise<Event[]> {
        return await this.eventStorage.getEventsByHostId(orgId);
    }

    async getEventsByOrganisations(orgIds : number[]) : Promise<Event[]> {
        const promises: Promise<Event[]>[] = orgIds.map(orgId => this.eventStorage.getEventsByHostId(orgId));
        const events = await Promise.all(promises);
        return events.flat().sort((a: Event, b: Event) => {
            return a.date.getTime() - b.date.getTime();
        });
    }

    async getAllEvents() : Promise<Event[]> {
        return await this.eventStorage.getAllEvents();
    }

    async getEvent(eventId : number) : Promise<Event | undefined>{
        let event : Event | null | undefined = await this.eventStorage.getEventById(eventId);
        if (event === null){
            event = undefined;
        }

        return event;
    }
}