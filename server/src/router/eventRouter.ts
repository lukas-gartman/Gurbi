import express, { Router, Request, Response } from "express";
import { AuthorizedRequest, ServiceResponse } from "../model/dataModels";
import { NewEventDTO, Event} from "../model/eventModels";
import {IEventService } from "../service/eventService";

export function getEventRouter(eventService : IEventService) : Router {
    const eventRouter : Router = express.Router();

    eventRouter.post("/authorized/organisation/:orgId", async (req : AuthorizedRequest<{orgId : number},{}, NewEventDTO>, res : Response<{ msg: string, eventId: number }>)  => {
        try {
            let orgId : number = req.params.orgId;
            let { response, eventId } : { response: ServiceResponse, eventId?: number | undefined } = await eventService.addEvent(req.body, orgId, req.userId as number)
            return res.status(response.httpStatusCode).send({msg: response.msg, eventId: eventId as number});
        } catch (e: any) {
            return res.status(500).send(e.message);
        }
    });

    eventRouter.put("/authorized/organisation/:orgId", async (req : AuthorizedRequest<{orgId: number},{}, { eventId: number, formData: NewEventDTO }>, res : Response<{ messages: string[] }>)  => {
        try {
            const eventId = req.body.eventId;
            const orgId = req.params.orgId;
            const response = await eventService.updateEvent(req.body.formData, eventId, orgId, req.userId as number);
            if (response.length == 1) {
                return res.status(response[0].httpStatusCode).send({ messages: [response[0].msg] });
            } else {
                return res.status(response[0].httpStatusCode).send({ messages: response.map(r => r.msg) }); // Assuming that multiple messages = same error status code
            }
        } catch (e: any) {
            return res.status(500).send(e.message);
        }
    });

    eventRouter.delete("/:eventId/authorized/organisation/:orgId", async (req : AuthorizedRequest<{eventId: number, orgId: number},{}, {}>, res : Response<string>)  => {
        try {
            const eventId = req.params.eventId;
            const orgId = req.params.orgId;
            const userId = req.userId as number;
            const response = await eventService.deleteEvent(eventId, orgId, userId);
            
            return res.status(response.httpStatusCode).send(response.msg);
        } catch (e: any) {
            return res.status(500).send(e.message);
        }
    });

    eventRouter.post("/authorized/following", async (req: AuthorizedRequest<{},{},{orgIds: number[]}>, res : Response<Event[]>) => {
        try {
            const orgIds = req.body.orgIds as number[];
            const events: Event[] = await eventService.getEventsByOrganisations(orgIds);
            return res.status(200).send(events);
        } catch (e: any) {
            console.log(e.message)
            return res.status(500).send(e.message);
        }
    });

    eventRouter.get("/organisation/:orgId/all", async (req: Request<{orgId : number},{},{}>, res : Response<Event[]>) => {
        try {
            let orgId : number = req.params.orgId;
            let response : Event[] = await eventService.getOrganisationEvents(orgId);
            return res.status(200).send(response);
        } catch (e : any) {
            return res.status(500).send(e.message);
        }
    });

    eventRouter.get("/all", async (req: Request<{},{},{}>, res : Response<Event[]>) => {
        try {
            let response : Event[] = await eventService.getAllEvents();
            return res.status(200).send(response);    
        } catch (e : any) {
            return res.status(500).send(e.message);
        }
    });

    eventRouter.get("/:eventId", async (req: Request<{eventId : number},{},{}>, res : Response<Event | undefined>) =>{
        try {
            let eventId : number = req.params.eventId;
            let response : Event | undefined = await eventService.getEvent(eventId);
            return res.status(200).send(response);    
        } catch (e : any) {
            return res.status(500).send(e.message);
        }
    });

    return eventRouter;
}