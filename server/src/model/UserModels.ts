import { ServiceResponse } from "./dataModels";

export interface DBUser {
    id: number;
    name: string;
    nickName: string
    encryptedPassword: string;
    email: string;
    regDate: Date;
    picture: string;
}

export interface UserLogin {
    email: string;
    password: string;
}

export interface IUser {
    id: number;
    name: string;
    nickName: string
    email: string;
    regDate: Date;
    picture: string;
}

export class userServiceResponse implements ServiceResponse{
    httpStatusCode: number;
    msg: string;
    id: number;

    private constructor(httpStatusCode: number, msg: string, id: number) {
        this.httpStatusCode = httpStatusCode;
        this.msg = msg;
        this.id = id;
    }

    private static readonly serverResponses: userServiceResponse[] = [
        {httpStatusCode: 400, msg: "missing feild value", id: 1},
        {httpStatusCode: 400, msg: "password are not matching", id: 2},
        {httpStatusCode: 400, msg: "mail is already used", id: 3},
        {httpStatusCode: 200, msg: "successfully registered", id: 4},
    ];

    static getResponse(id: number): userServiceResponse {
        let resposne: userServiceResponse | undefined = this.serverResponses.find(res => res.id === id);
        if (resposne === undefined) {
            throw Error("not know id");
        }
        return new userServiceResponse(resposne.httpStatusCode, resposne.msg, resposne.id);
    }

}