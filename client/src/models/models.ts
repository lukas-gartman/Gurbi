export interface IOrganisation {
    id: number;
    name: string;
    members: string[];
    roles: string[];
    picture: string;
    description: string;
}

export interface IEvent {
    id: number;
    name: string;
    host: IOrganisation;
    location: string;
    description: string;
    dateTime: Date;
    picture: string;
}

// hostId : number
// id : number
// title : string
// location : string
// description : string
// date : Date
// picture : string

export interface IUser {
    id: number;
    name: string;
    nickName: string
    email: string;
    regDate: Date;
    picture: string;
}

export interface IProfile {
    user: IUser;
    membershipsCount: number;
    followingCount: number;
    savedEvents: IEvent[];
}
