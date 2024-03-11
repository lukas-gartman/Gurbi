import { MY_NOT_VERY_SECURE_PRIVATE_KEY } from "../app";
import { MongoDBUserStorage, UserStorage } from "../db/user.db";
import { DBUser, IUser, userServiceResponse } from "../model/UserModels";
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export class UserService {
    private userStorage : UserStorage;

    constructor(userStorage : UserStorage) {
        this.userStorage = userStorage;
    }

    async regNewUser(userInfo : {fullName: string, nickname: string, email: string, password: string, repeatPassword: string}) : Promise<userServiceResponse> {
        if (!userInfo.fullName.trim() || !userInfo.email.trim() || !userInfo.password.trim() || !userInfo.repeatPassword.trim()) {
            return userServiceResponse.getRes(1);
        }
        if (userInfo.password !== userInfo.repeatPassword) {
            return userServiceResponse.getRes(2);
        }
        if (await this.userStorage.isEmailExists(userInfo.email)) {
            return userServiceResponse.getRes(3);
        }

        let hashedPassword : string = await bcrypt.hash(userInfo.password, 10);
        let user : DBUser = { name: userInfo.fullName, nickName: userInfo.nickname, encryptedPassword: hashedPassword, email: userInfo.email, id: 0, regDate: new Date(), picture: "/public/images/default-profile-picture.png" };
        await this.userStorage.addUser(user);

        return userServiceResponse.getRes(4);
    }
    
    async loginUser(userInput : {email: string, password: string, rememberMe: boolean}) : Promise<{token: string, succes: boolean}> {
        if (!userInput.email.trim() || !userInput.password.trim()) {
            return {token : "", succes : false};
        }

        let user : DBUser | null = await this.userStorage.getUserByEmail(userInput.email);
        if (user === null) {
            return {token : "", succes : false};
        }

        let isPassword : boolean = await bcrypt.compare(userInput.password, user.encryptedPassword);
        if (!isPassword) {
            return {token : "", succes : false};
        }

        if (userInput.rememberMe) {
            return {token: jwt.sign({userId : user.id} , MY_NOT_VERY_SECURE_PRIVATE_KEY), succes: true};
        } else {
            return {token: jwt.sign({userId : user.id} , MY_NOT_VERY_SECURE_PRIVATE_KEY, { expiresIn: '24h' }), succes: true};
        }
    }

    async getUser(userId: number): Promise<IUser | null> {
        const u: DBUser | null = await this.userStorage.getUserById(userId);
        let user: IUser | null = null;
        if (u !== null) {
            user = { id: u.id, name: u.name, nickName: u.nickName, email: u.email, regDate: u.regDate, picture: u.picture }
        }

        return user;
    }
}
