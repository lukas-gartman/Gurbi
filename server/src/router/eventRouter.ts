import express, { Router, Request, Response } from "express";
import { AuthorizedRequest, ServiceResponse } from "../model/dataModels";
import { NewEventDTO, Event} from "../model/eventModels";
import { EventService } from "../service/eventService";

export function getEventRouter(eventService : EventService) : Router{

    const organisationRouter : Router = express.Router();


    organisationRouter.post("/authorized/organisation/:orgId", async (req : AuthorizedRequest<{orgId : string},{}, NewEventDTO>, res : Response<string>)  => {
        try {
            let orgId : string = req.params.orgId.toString()
        
            let response : ServiceResponse = await eventService.addEvent(req.body, orgId, req.userId as string)
            return res.status(response.httpStatusCode).send(response.msg);

        } catch (e: any) {
            return res.status(500).send(e.message);
        }
    });


    organisationRouter.get("/organisation/:orgId/all", async (req: Request<{orgId : string},{},{}>, res : Response<Event[]>) => {
        try {
            let orgId : string = req.params.orgId.toString();
            let response : Event[] = await eventService.getOrganisationEvents(orgId);
            return res.status(200).send(response);
            
            
        } catch (e : any) {
            return res.status(500).send(e.message);
        }
    })


    organisationRouter.get("/all", async (req: Request<{},{},{}>, res : Response<Event[]>) => {
        try {
            let response : Event[] = await eventService.getAllEvents();
            return res.status(200).send(response);    
        } catch (e : any) {
            return res.status(500).send(e.message);
        }
    })   

    return organisationRouter;

}