
export interface Event{
    hostOrganisationId : string
    eventId : string
    name : string
    location : string
    description : string
    dateTime : Date
    price : number
}


//data transfer object
export interface NewEventDTO{
    hostOrganisationId : string
    name : string
    location : string
    description : string
    dateTime : Date
    price : number
}