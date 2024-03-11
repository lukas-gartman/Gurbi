export interface IOrganisation {
    id: number;
    name: string;
    members: string[];
    roles: string[];
    picture: string;
}

export interface IEvent {
    id: number;
    name: string;
    host: IOrganisation;
    location: string;
    description: string;
    dateTime: Date;
    price: number;
    picture: string;
}