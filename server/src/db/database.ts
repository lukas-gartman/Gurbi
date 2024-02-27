import mongoose, { Connection, Model, Schema, createConnection } from "mongoose";



export const conn = createConnection("mongodb://localhost:27017/dat076");


interface CounterDocument extends Document {
    _id: string;
    value: number;
}

/**
 * Represents a counter used to store a numerical value associated with a collection.
 * Useful for generating unique IDs
 */
class TotalCounter {
    private readonly model: Model<CounterDocument>;
    private collectionName : string;

    constructor(collectionName: string) {
        const counterSchema = new Schema({
            _id: { type: String, default: `${collectionName}_Counter` }, // Include collection name in _id
            value: { type: Number, default: 0 },
        });

        this.model = conn.model<CounterDocument>('TotalCounters', counterSchema); // Use a common collection name for all counters
        this.collectionName = collectionName;
    }

    async getCounterValue(): Promise<number> {
        const counterDocument = await this.model.findOne({ _id: `${this.collectionName}_Counter` });

        return counterDocument ? counterDocument.value : 0;
    }

    async incrementCounter(): Promise<void> {
        await this.model.updateOne(
            { _id: `${this.collectionName}_Counter` },
            { $inc: { value: 1 } },
            { upsert: true }
        );
    }
}

export default TotalCounter;