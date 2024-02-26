//import { conn } from "../db/database";
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



//MongoDB modell


import mongoose, { Schema, Document } from 'mongoose';


const organisationSchema: Schema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        alias: '_id',
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


// export const OrganisationModel = conn.model<Organisation>("Organisation", organisationSchema);

//storage
export interface OrganisationStorageHandler {
    getOrganisationsByUser(userId: string): Promise<Organisation[]>;
  
    getAllOrganisations(): Promise<Organisation[]>;
  
    getOrganisationById(organisationId: string): Promise<Organisation | null>;
  
    postOrganisation(org: Organisation): Promise<boolean>;
  
    deleteOrganisationById(organisationId: string): Promise<boolean>;
  }

// export class MongoDBOrganisationStorageHandler implements OrganisationStorageHandler {

//     async getOrganisationsByUser(userId: string): Promise<Organisation[]> {
//       try {
//         const organisations = await OrganisationModel.find({ 'members.userId': userId }).exec();
//         return organisations;
//       } catch (error) {
//         console.error(error);
//         return [];
//       }
//     }
  
//     async getAllOrganisations(): Promise<Organisation[]> {
//       try {
//         const organisations = await OrganisationModel.find().exec();
//         return organisations;
//       } catch (error) {
//         console.error(error);
//         return [];
//       }
//     }
  
//     async getOrganisationById(organisationId: string): Promise<Organisation | null> {
//       try {
//         const organisation = await OrganisationModel.findById(organisationId).exec();
//         return organisation;
//       } catch (error) {
//         console.error(error);
//         return null;
//       }
//     }
  
//     async postOrganisation(org: Organisation): Promise<boolean> {
//       try {
//         await OrganisationModel.findByIdAndUpdate(org.id, org, { upsert: true, new: true }).exec();
//         return true;
//       } catch (error) {
//         console.error(error);
//         return false;
//       }
//     }
  
//     async deleteOrganisationById(organisationId: string): Promise<boolean> {
//       try {
//         await OrganisationModel.findByIdAndDelete(organisationId).exec();
//         return true;
//       } catch (error) {
//         console.error(error);
//         return false;
//       }
//     }
//   }


export class MemoryOrganisationStorageHandler implements OrganisationStorageHandler{
    
    private organisations : Organisation[] = [];
    
    async postOrganisation(inOrg: Organisation): Promise<boolean> {

        let orgIndex : number | undefined= this.organisations.findIndex(orgElement => orgElement.id === inOrg.id)

        if(orgIndex === -1){
            this.organisations.push(inOrg);
        }
        else{
            this.organisations[orgIndex] = inOrg;
        }

        return true;
        
    }


    async deleteOrganisationById(organisationId: string): Promise<boolean> {
        this.organisations.splice(this.organisations.findIndex(org => org.id === organisationId) ,1)
        return true;
    }

    
    async getOrganisationsByUser(userId: string): Promise<Organisation[]> {
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


    async getAllOrganisations(): Promise<Organisation[]> {
        return JSON.parse(JSON.stringify(this.organisations));
    }

    
    async getOrganisationById(organisationId: string): Promise<Organisation | null> {
        try {
            return JSON.parse(JSON.stringify(this.organisations.find(org => org.id === organisationId)));      
        } catch (error) {
            return null;
        }
    }

}