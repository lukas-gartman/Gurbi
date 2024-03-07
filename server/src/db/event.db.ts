import { Error, Schema } from "mongoose";
import TotalCounter, { DBconnHandler } from "./database";
import { Event } from "../model/eventModels";
import { promises } from "dns";

const eventSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true},
    hostId : {type: String, required: true},
    title: { type: String, required: true },
    location: { type: String, required: true},
    description: { type: String, required: true },
    picture: { type: String, required: true},
    date: { type: Date, required: true},
});



//storage
export interface EventStorage {
    getEventById(id: string): Promise<Event | null>;

    updateEvent(updatedEvent: Event): Promise<void>;

    addEvent(newEvent: Event): Promise<void>;
  
    deleteEventById(id: string): Promise<void>;

    getEventsByHostId(hostId : string) : Promise<Event[]>;
  }

  export class MongoDBEventStorage implements EventStorage {
    private eventModel = DBconnHandler.getConn().model<Event>("events", eventSchema);

    private idCounter : TotalCounter = new TotalCounter("events");

    async getEventById(id: string): Promise<Event | null> {
        const event = await this.eventModel.findOne({id: id}).exec();
        return event ? event.toObject() : null;
    }

    async getEventsByHostId(hostId : string) : Promise<Event[]>{
        return await this.eventModel.find({hostId : hostId}).exec();
    }

    async updateEvent(updatedEvent: Event): Promise<void> {
        await this.eventModel.findOneAndUpdate({id: updatedEvent.id}, updatedEvent, { new: true }).exec();
    }

    async addEvent(newEvent: Event): Promise<void> {
        newEvent.id = (await this.idCounter.getCounterValue()).toString();
        await this.idCounter.incrementCounter();
        await this.eventModel.create(newEvent);
    }

    async deleteEventById(id: string): Promise<void> {
        await this.eventModel.findOneAndDelete({id : id}).exec();
    }


}