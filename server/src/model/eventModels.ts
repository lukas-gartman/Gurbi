
export interface Event{
    hostId : string
    id : string
    title : string
    location : string
    description : string
    date : Date
    picture : string
}


//data transfer object
export interface NewEventDTO{
    title: string;
    date: Date;
    location: string;
    description: string;
}