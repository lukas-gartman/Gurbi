import { MongoDBUserStorage, UserStorageHandler } from "../db/user.db";
import { DBUser, userServiceResponse } from "../model/UserModels";

export class UserService{

    private userStorage : UserStorageHandler;

    constructor(){
        this.userStorage = new MongoDBUserStorage();
    }

    async addNewUser(userInfo : {fullName: string, nickname: string, email: string, password: string, repeatPassword: string}) : Promise<userServiceResponse>{
       
        if (!userInfo.fullName.trim() || !userInfo.nickname.trim() || !userInfo.email.trim() || !userInfo.password.trim() || !userInfo.repeatPassword.trim()) {
            return userServiceResponse.getRes(1);
        };
        if(userInfo.password !== userInfo.repeatPassword){
            return userServiceResponse.getRes(2);
        }
        if(await this.userStorage.isEmailExists(userInfo.email)){
            return userServiceResponse.getRes(3);
        }

        let user : DBUser = {name : userInfo.fullName, nickName : userInfo.nickname, encryptedPassword : userInfo.password, email : userInfo.email, salt : "awdawf", id : "0", regDate :  new Date()}

        await this.userStorage.addUser(user);

        return userServiceResponse.getRes(4);
    }
    


}




