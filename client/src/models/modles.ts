import { Organisation } from "../../../server/src/model/organisationModels"

export interface Event{
    host : Organisation
    id : string
    name : string
    location : string
    description : string
    dateTime : Date
    price : number
    picture : string
}