import { ServiceResponse } from "./dataModels"

export interface Event {
    hostId : number
    id : number
    title : string
    location : string
    description : string
    date : Date
    picture : string
}

//data transfer object
export interface NewEventDTO {
    title: string;
    date: Date;
    location: string;
    description: string;
}

export class EventServiceResponse implements ServiceResponse {
    httpStatusCode: number;
    msg: string;
    id: number;

    private constructor(httpStatusCode: number, msg: string, id: number) {
        this.httpStatusCode = httpStatusCode;
        this.msg = msg;
        this.id = id;
    }

    private static readonly serverResponses: EventServiceResponse[] = [
        { httpStatusCode: 400, msg : "missing data", id: 0 },
        { httpStatusCode: 200, msg : "added event", id: 1 }
    ];

    static getResponse(id: number): EventServiceResponse {
        let resposne: EventServiceResponse | undefined = this.serverResponses.find(res => res.id === id);
        if (resposne === undefined) {
            throw Error("not know id");
        }
        return new EventServiceResponse(resposne.httpStatusCode, resposne.msg, resposne.id);
    }
}
