
export interface Event{
    hostid : string
    id : string
    name : string
    location : string
    description : string
    dateTime : Date
    price : number
    picture : string
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