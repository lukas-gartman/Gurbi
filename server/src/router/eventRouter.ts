import express, { Router, Request, Response } from "express";
import { AuthorizedRequest, ServiceResponse } from "../model/dataModels";
import { NewEventDTO, Event} from "../model/eventModels";
import { EventService } from "../service/eventService";

export function getEventRouter(eventService : EventService) : Router {
    const eventRouter : Router = express.Router();

    eventRouter.post("/authorized/organisation/:orgId", async (req : AuthorizedRequest<{orgId : string},{}, NewEventDTO>, res : Response<string>)  => {
        try {
            let orgId : string = req.params.orgId.toString()
        
            let response : ServiceResponse = await eventService.addEvent(req.body, orgId, req.userId as string)
            return res.status(response.httpStatusCode).send(response.msg);

        } catch (e: any) {
            return res.status(500).send(e.message);
        }
    });

    eventRouter.post("/authorized/following", async (req: AuthorizedRequest<{orgIds: string[]},{},{}>, res : Response<Event[]>) => {
        try {
            const orgIds = req.params.orgIds as string[];
            const events: Event[] = await eventService.getEventsByOrganisations(orgIds);
            return res.status(200).send(events);
        } catch (e: any) {
            return res.status(500).send(e.message);
        }
    });

    eventRouter.get("/organisation/:orgId/all", async (req: Request<{orgId : string},{},{}>, res : Response<Event[]>) => {
        try {
            let orgId : string = req.params.orgId.toString();
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

    eventRouter.get("/:eventId", async (req: Request<{eventId : string},{},{}>, res : Response<Event | undefined>) =>{
        try {
            let eventId : string = req.params.eventId.toString();
            let response : Event | undefined = await eventService.getEvent(eventId);
            return res.status(200).send(response);    
        } catch (e : any) {
            return res.status(500).send(e.message);
        }
    });

    return eventRouter;
}