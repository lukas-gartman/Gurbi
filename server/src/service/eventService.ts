import {OrganisationPermissionChecker, Permission, ServiceResponse} from "../model/dataModels"
import {Event, EventServiceResponse, NewEventDTO} from "../model/eventModels"
import { EventStorage } from "../db/event.db";

export interface IEventService {
    addEvent(eventData : NewEventDTO, orgId : number, userId : number) : Promise<{response: ServiceResponse, eventId?: number | undefined}>;
    updateEvent(eventData: NewEventDTO, eventId: number, orgId: number, userId: number): Promise<ServiceResponse[]>;
    deleteEvent(eventId: number, orgId: number, userId: number): Promise<ServiceResponse>;
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

    async addEvent(eventData : NewEventDTO, orgId : number, userId : number) : Promise<{ response: ServiceResponse, eventId?: number | undefined }> {
        let checkPerm : { serverRes: ServiceResponse, succes: boolean } = await this.orgPremChecker.memberPermissionCheck(orgId, userId, Permission.CreateNewEvent);
        if (!checkPerm.succes) {
            return { response: checkPerm.serverRes }
        }

        let event : Event = eventData as Event;
        event.id = 0;
        event.hostId = orgId;
        event.picture = "/public/images/default-event-picture.png";

        try {
            const eventId = await this.eventStorage.addEvent(event);
            return { response: EventServiceResponse.getResponse(1), eventId: eventId };
        } catch (e : any) {
            return { response: EventServiceResponse.getResponse(0) };
        }
    }

    async updateEvent(eventData: NewEventDTO, eventId: number, orgId: number, userId: number): Promise<ServiceResponse[]> {
        const errors: ServiceResponse[] = [];
        const event = await this.eventStorage.getEventById(eventId) as Event;
        
        if (event.title !== eventData.title) {
            const checkTitlePerm = (await this.orgPremChecker.memberPermissionCheck(orgId, userId, Permission.ChangeEventName))
            if (!checkTitlePerm.succes) {
                errors.push(checkTitlePerm.serverRes);
            }
        }

        if (event.date !== eventData.date) {
            const checkDatePerm = (await this.orgPremChecker.memberPermissionCheck(orgId, userId, Permission.ChangeEventDate))
            if (!checkDatePerm.succes) {
                errors.push(checkDatePerm.serverRes);
            }
        }

        if (event.location !== eventData.location) {
            const checkLocationPerm = (await this.orgPremChecker.memberPermissionCheck(orgId, userId, Permission.ChangeEventLocation))
            if (!checkLocationPerm.succes) {
                errors.push(checkLocationPerm.serverRes);
            }
        }

        if (event.description !== eventData.description) {
            const checkDescriptionPerm = (await this.orgPremChecker.memberPermissionCheck(orgId, userId, Permission.ChangeEventDescription))
            if (!checkDescriptionPerm.succes) {
                errors.push(checkDescriptionPerm.serverRes);
            }
        }

        if (errors.length != 0) {
            return errors;
        }

        const updatedEvent = eventData as Event;
        updatedEvent.id = eventId;
        updatedEvent.hostId = orgId;

        try {
            if (await this.eventStorage.updateEvent(updatedEvent)) {
                return [EventServiceResponse.getResponse(2)];
            } else {
                return [EventServiceResponse.getResponse(4)];
            }
        } catch (e : any) {
            return [EventServiceResponse.getResponse(0)];
        }
    }

    async deleteEvent(eventId: number, orgId: number, userId: number): Promise<ServiceResponse> {
        const checkPerm = (await this.orgPremChecker.memberPermissionCheck(orgId, userId, Permission.DeleteEvent));
        if (!checkPerm.succes) {
            return checkPerm.serverRes;
        }

        try {
            await this.eventStorage.deleteEventById(eventId);
            return EventServiceResponse.getResponse(3);
        } catch {
            return EventServiceResponse.getResponse(4);
        }
    }

    async getOrganisationEvents(orgId : number) : Promise<Event[]> {
        return await this.eventStorage.getEventsByHostId(orgId);
    }

    async getEventsByOrganisations(orgIds : number[]) : Promise<Event[]> {
        let unsortedEvents: Event[] = [];
        for (let i = 0; i < orgIds.length; i++) {
            const orgId = orgIds[i];
            let orgEvents: Event[] = await this.eventStorage.getEventsByHostId(orgId);
            for (let j = 0; j < orgEvents.length; j++) {
                const event = orgEvents[j];
                unsortedEvents.push(event);
            }
        }
//        const promises: Promise<Event[]>[] = orgIds.map(async orgId => await this.eventStorage.getEventsByHostId(orgId));
//        const events = await Promise.all(promises);
        return unsortedEvents.flat().sort((a: Event, b: Event) => {
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