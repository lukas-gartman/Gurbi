import { Error, Schema } from "mongoose";
import { DBUser } from "../model/UserModels";
import TotalCounter, { DBconnHandler } from "./database";

const userSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true},
    name: { type: String, required: true },
    nickName: { type: String, required: true },
    encryptedPassword: { type: String, required: true },
    salt: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    regDate: { type: Date, required: true },
});



//storage
export interface UserStorageHandler {
    getUserById(id: string): Promise<DBUser | null>;
  
    getUserByEmail(email: string): Promise<DBUser | null>;
  
    updateUser(DBUser: DBUser): Promise<void>;

    addUser(DBUser: DBUser): Promise<void>;
  
    deleteUserById(id: string): Promise<void>;

    isEmailExists(email: string) : Promise<boolean>;
    
    changePassword(userId: string, newPassword: string): Promise<void>;
}

export class MongoDBUserStorage implements UserStorageHandler {
    private userModel = DBconnHandler.getConn().model<DBUser>("users", userSchema);

    private idCounter : TotalCounter = new TotalCounter("users");

    async getUserById(id: string): Promise<DBUser | null> {
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
		this.updateUser(this.getUserBysid(userId).encryptedPassword = newPassword);
	}

    async addUser(newUser: DBUser): Promise<void> {
        newUser.id = (await this.idCounter.getCounterValue()).toString();
        console.log(newUser)
        await this.idCounter.incrementCounter();
        await this.userModel.create(newUser);
    }

    async deleteUserById(id: string): Promise<void> {
            await this.userModel.findOneAndDelete({id : id}).exec();
    }

    async isEmailExists(email: string): Promise<boolean> {
            const existingUser = await this.userModel.findOne({ email : email});
            return !!existingUser;
    }
}
