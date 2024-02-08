export interface Event{
    id : string
    name : string
    location : string
    description : string
    dateTime : Date
}

export interface Organisation{
    id : string
    name : string
}


export interface UserData{
    id : string
    name : string
    password : string
    salt : string
    email : string
    regDate : Date
}

export interface UserLogin{
    email : string
    password : string
}


