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
    changePassword(userId: string, newPassword: string): Promise<void>;
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

	async changePassword(userId: string, newPassword: string): Promise<void>
	{
		this.updateUser(this.getUserByid(userId).encryptedPassword = newPassword);
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

export class MemoryUserStorage implements UserStorage {
    private users : DBUser[] = [];
    private idCounter : number = 0;
    
    async getUserById(id: number): Promise<DBUser | null> {
        try {
            return JSON.parse(JSON.stringify(this.users.find(user => user.id === id)));
        } catch (e : any) {
            return null;
        }
    }
    
    async getUserByEmail(email: string): Promise<DBUser | null> {
        try {
            return JSON.parse(JSON.stringify(this.users.find(user => user.email === email)));
        } catch (e : any) {
            return null;
        }
    }
    
    async updateUser(updatedUser: DBUser): Promise<void> {
        this.users.splice(this.users.findIndex(user => user.id === updatedUser.id), 1, updatedUser);
    }
	
	async changePassword(userId: string, newPassword: string): Promise<void>
	{
		this.updateUser(this.getUserByid(userId).encryptedPassword = newPassword);
	}
	
    async addUser(user: DBUser): Promise<void> {
        this.idCounter++;
        user.id = this.idCounter;
        this.users.push(user);
    }

    async deleteUserById(id: number): Promise<void> {
        this.users.splice(this.users.findIndex(user => user.id === id), 1);
    }

    async isEmailExists(email: string): Promise<boolean> {
        const existingUser: DBUser | null = await this.getUserByEmail(email);
        return !!existingUsers;
    }
}
