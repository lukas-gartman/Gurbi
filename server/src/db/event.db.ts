import { Error, Schema } from "mongoose";
import TotalCounter, { DBconnHandler } from "./database";
import { Event } from "../model/eventModels";
import { promises } from "dns";

const eventSchema: Schema = new Schema({
    id: { type: Number, required: true, unique: true},
    hostId : {type: Number, required: true},
    title: { type: String, required: true },
    location: { type: String, required: true},
    description: { type: String, required: true },
    picture: { type: String },
    date: { type: Date, required: true},
});

//storage
export interface EventStorage {
    getEventById(id: number): Promise<Event | null>;
    updateEvent(updatedEvent: Event): Promise<void>;
    addEvent(newEvent: Event): Promise<number>;
    deleteEventById(id: number): Promise<void>;
    getEventsByHostId(hostId : number) : Promise<Event[]>;
    getAllEvents(): Promise<Event[]>;
}

export class MongoDBEventStorage implements EventStorage {
    private eventModel = DBconnHandler.getConn().model<Event>("events", eventSchema);
    private idCounter : TotalCounter = new TotalCounter("events");

    async getEventById(id: number): Promise<Event | null> {
        const event = await this.eventModel.findOne({id: id}).exec();
        return event ? event.toObject() : null;
    }

    async getEventsByHostId(hostId : number) : Promise<Event[]>{
        return await this.eventModel.find({hostId : hostId}).exec();
    }

    async updateEvent(updatedEvent: Event): Promise<void> {
        await this.eventModel.findOneAndUpdate({id: updatedEvent.id}, updatedEvent, { upsert: true, new: false }).exec();
    }

    async addEvent(newEvent: Event): Promise<number> {
        newEvent.id = (await this.idCounter.getCounterValue());
        await this.idCounter.incrementCounter();
        await this.eventModel.create(newEvent);
        return newEvent.id;
    }

    async deleteEventById(id: number): Promise<void> {
        await this.eventModel.findOneAndDelete({id : id}).exec();
    }

    async getAllEvents(): Promise<Event[]> {
        const events = await this.eventModel.find().exec();
        return events;
    }
}
