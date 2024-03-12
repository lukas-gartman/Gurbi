import { Error, Schema } from "mongoose";
import { DBUser } from "../model/UserModels";
import TotalCounter, { DBconnHandler } from "./database";

const userSchema: Schema = new Schema({
    id: { type: Number, required: true, unique: true},
    name: { type: String, required: true },
    nickName: { type: String},
    encryptedPassword: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    regDate: { type: Date, required: true },
	picture: {type: String, required: true }
});

//storage
export interface UserStorage {
    getUserById(id: number): Promise<DBUser | null>;
    getUserByEmail(email: string): Promise<DBUser | null>;
    updateUser(DBUser: DBUser): Promise<void>;
    addUser(DBUser: DBUser): Promise<void>;
    deleteUserById(id: number): Promise<void>;
    isEmailExists(email: string) : Promise<boolean>;
}

export class MongoDBUserStorage implements UserStorage {
	private userModel = DBconnHandler.getConn().model<DBUser>("users", userSchema);
    private idCounter : TotalCounter = new TotalCounter("users");

    async getUserById(id: number): Promise<DBUser | null> {
	    const user = await this.userModel.findOne({id: id}).exec();
	    return user ? user.toObject() : null;
    }

    async getUserByEmail(email: string): Promise<DBUser | null> {
	    const user = await this.userModel.findOne({email: email }).exec();
	    return user ? user.toObject() : null;
    }

    async updateUser(updatedUser: DBUser): Promise<void> {
		await this.userModel.findOneAndUpdate({id: updatedUser.id}, updatedUser, { new: true }).exec();
    }

    async addUser(newUser: DBUser): Promise<void> {
		newUser.id = (await this.idCounter.getCounterValue());
		await this.idCounter.incrementCounter();
		await this.userModel.create(newUser);
    }

    async deleteUserById(id: number): Promise<void> {
	    await this.userModel.findOneAndDelete({id : id}).exec();
    }

    async isEmailExists(email: string): Promise<boolean> {
	    const existingUser = await this.userModel.findOne({ email : email});
	    return !!existingUser;
    }
}