export interface Event{
    id : string
    name : string
    location : string
    description : string
    dateTime : Date
    picture: string
    host: Organisation
}

export interface Organisation{
    id : string
    name : string
    picture: string
}

export class User {
    public id : string
    private name : string
    private password : string
    private salt : string
    private email : string
    private regDate : Date

    constructor(name: string, email: string, password: string, ) {
	this.id = "id1234";
	this.salt = "salt1234"; 
	this.regDate = new Date();

	this.name = name;
	this.email = email;
	this.password = password;
    }
}

export interface UserLogin{
    email : string
    password : string
}

export interface IUser {
    id: number
    name: string
    email: string
    regDate: Date
    picture: string
}
