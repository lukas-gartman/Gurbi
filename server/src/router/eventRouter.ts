import express, { Router, Request, Response } from "express";
import { AuthorizedRequest, ServiceResponse } from "../model/dataModels";
import { NewEventDTO, Event} from "../model/eventModels";
import {IEventService } from "../service/eventService";

export function getEventRouter(eventService : IEventService) : Router {
    const eventRouter : Router = express.Router();

    eventRouter.post("/authorized/organisation/:orgId", async (req : AuthorizedRequest<{orgId : number},{}, NewEventDTO>, res : Response<string>)  => {
        try {
            let orgId : number = req.params.orgId;
            let response : ServiceResponse = await eventService.addEvent(req.body, orgId, req.userId as number)
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