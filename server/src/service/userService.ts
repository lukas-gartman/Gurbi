import { MY_NOT_VERY_SECURE_PRIVATE_KEY } from "../app";
import { UserStorage } from "../db/user.db";
import { DBUser, IUser, userServiceResponse } from "../model/UserModels";
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export interface IUserService {
    regNewUser(userInfo : {fullName: string, nickname: string, email: string, password: string, repeatPassword: string}) : Promise<userServiceResponse>;
    loginUser(userInput : {email: string, password: string, rememberMe: boolean}) : Promise<{token: string, succes: boolean, response: userServiceResponse}>;
    getUser(userId: number): Promise<IUser | null>;
    changePassword(userId: number, password: string, repeatPassword: string, newPassword: string): Promise<userServiceResponse>;
}

export class UserService implements IUserService {
    private userStorage : UserStorage;

    constructor(userStorage : UserStorage) {
        this.userStorage = userStorage;
    }

    async regNewUser(userInfo : {fullName: string, nickname: string, email: string, password: string, repeatPassword: string}) : Promise<userServiceResponse> {
        if (!userInfo.fullName.trim() || !userInfo.email.trim() || !userInfo.password.trim() || !userInfo.repeatPassword.trim()) {
            return userServiceResponse.getResponse(1);
        }
      
        if (userInfo.password !== userInfo.repeatPassword) {
            return userServiceResponse.getResponse(2);
        }
      
        if (await this.userStorage.isEmailExists(userInfo.email)) {
            return userServiceResponse.getResponse(3);
        }

        let hashedPassword : string = await bcrypt.hash(userInfo.password, 10);
        let user : DBUser = { name: userInfo.fullName, nickName: userInfo.nickname, encryptedPassword: hashedPassword, email: userInfo.email, id: 0, regDate: new Date(), picture: "/public/images/default-profile-picture.png" };
        await this.userStorage.addUser(user);

        return userServiceResponse.getResponse(4);
    }
    
    async changePassword(userId: number, password: string, repeatPassword: string, newPassword: string): Promise<userServiceResponse> {
        if (!password.trim() || !repeatPassword.trim() || !newPassword.trim()){
            return userServiceResponse.getResponse(1)
        }

        if (newPassword !== repeatPassword) {
            return userServiceResponse.getResponse(2);
        }

        let user : DBUser | null = await this.userStorage.getUserById(userId);

        if (user === null) {
            return userServiceResponse.getResponse(1)
        }

        let isPassword : boolean = await bcrypt.compare(password, user.encryptedPassword);

        if (isPassword) {
            let hashedPassword : string = await bcrypt.hash(newPassword, 10);
            user.encryptedPassword = hashedPassword;
            await this.userStorage.updateUser(user);
            return userServiceResponse.getResponse(6);
        } else {
            return userServiceResponse.getResponse(5)
        }
    }

    async loginUser(userInput : {email: string, password: string, rememberMe: boolean}) : Promise<{token: string, succes: boolean, response: userServiceResponse}> {
        if (!userInput.email.trim() || !userInput.password.trim()) {
            return {token : "", succes : false, response: userServiceResponse.getResponse(1)};
        }

        let user : DBUser | null = await this.userStorage.getUserByEmail(userInput.email);
        if (user === null) {
            return {token : "", succes : false, response: userServiceResponse.getResponse(7)};
        }

        let isPassword : boolean = await bcrypt.compare(userInput.password, user.encryptedPassword);
        if (!isPassword) {
            return {token : "", succes : false, response: userServiceResponse.getResponse(7)};
        }

        if (userInput.rememberMe) {
            return {token: jwt.sign({userId : user.id} , MY_NOT_VERY_SECURE_PRIVATE_KEY), succes: true, response: userServiceResponse.getResponse(8)};
        } else {
            return {token: jwt.sign({userId : user.id} , MY_NOT_VERY_SECURE_PRIVATE_KEY, { expiresIn: '24h' }), succes: true, response: userServiceResponse.getResponse(8)};
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
