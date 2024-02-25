import {Permission} from "../model/dataModels"
  

export interface Role{
    roleName : string;
    permissions : Permission[];
}

export interface Member{
    userId : string;
    roleName : string;
    nickName : string;
}

export interface Organisation{
    members : Member[];
    roles : Role[];
    name : string;
    id : string;
    picture : string;
}


//convince
export interface NewOrganisationDTO{
    creatorNickName : string;
    orgName : string;
    roles : Role[];
}
export interface NewOrganisationData extends NewOrganisationDTO{
    creatorId : string
}

//MongoDB


import mongoose, { Schema, Document } from 'mongoose';


const organisationSchema: Schema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    members: [{
        userId: {
            type: String,
            required: true,
        },
        roleName: {
            type: String,
            required: true,
        },
        nickName: {
            type: String,
            required: true,
        },
    }],
    roles: [{
        roleName: {
            type: String,
            required: true,
        },
        permissions: [{
            permissionName: {
                type: String,
                required: true,
            },
            permissionId: {
                type: Number,
                required: true,
            },
        }],
    }],
    name: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
        required: true,
    },
});

export const OrganisationModel = mongoose.model<Organisation>('Organisation', organisationSchema);


export interface OrganisationStorageHandler {
    getOrganisationsByUser(userId: string): Organisation[];

    getAllOrganisations(): Organisation[];

    getOrganisationById(organisationId: string): Organisation | undefined;

    postOrganisation(org : Organisation) : boolean;

    deleteOrganisationById(organisationId: string) : boolean;
}


export class MemoryOrganisationStorageHandler implements OrganisationStorageHandler{
    
    private organisations : Organisation[] = [];
    
    postOrganisation(inOrg: Organisation): boolean {


        let orgIndex : number | undefined= this.organisations.findIndex(orgElement => orgElement.id === inOrg.id)

        if(orgIndex === -1){
            this.organisations.push(inOrg);
        }
        else{
            this.organisations[orgIndex] = inOrg;
        }

        return true;
        
    }
    deleteOrganisationById(organisationId: string): boolean {
        this.organisations.splice(this.organisations.findIndex(org => org.id === organisationId) ,1)
        return true;
    }

    

    getOrganisationsByUser(userId: string): Organisation[] {
        let userOrgs : Organisation[] = []
        this.organisations.forEach(org => {
            org.members.forEach(member => {
                if(member.userId === userId){
                    userOrgs.push(JSON.parse(JSON.stringify(org)))
                }
            });
        });

        return userOrgs;
    }
    getAllOrganisations(): Organisation[] {
        return JSON.parse(JSON.stringify(this.organisations));
    }
    getOrganisationById(organisationId: string): Organisation | undefined {
        try {
            return JSON.parse(JSON.stringify(this.organisations.find(org => org.id === organisationId)));      
        } catch (error) {
            return undefined;
        }
    }

}