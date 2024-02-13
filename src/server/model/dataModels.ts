export interface Event{
    id : string
    name : string
    location : string
    description : string
    dateTime : Date
}

export interface ServerModifierResponse{
    successState : boolean;
    msg : string;
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


