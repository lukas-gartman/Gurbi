import {Schema} from 'mongoose';
import { Organisation } from '../model/organisationModels';
import TotalCounter, { DBconnHandler } from './database';
import { Permission } from '../model/dataModels';


const organisationSchema: Schema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    members: [{
        userId: {
            type: Number,
            required: true,
        },
        roleName: {
            type: String,
            required: true,
        },
        nickName: {
            type: String,
        },
    }],
    roles: [{
        roleName: {
            type: String,
            required: true,
        },
        permissions: [{
            type: String,
            enum: Object.values(Permission),
            required: true,
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
    banner: {
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    }
});




//storage
export interface OrganisationStorage {
    getOrganisationsByUser(userId: number): Promise<Organisation[]>;
    getAllOrganisations(): Promise<Organisation[]>;
    getOrganisationById(organisationId: number): Promise<Organisation | null>;
    updateOrganisation(org: Organisation): Promise<boolean>;
    newOrganisation(org: Organisation): Promise<number>;
    deleteOrganisationById(organisationId: number): Promise<boolean>;
  }

  //need try catch
export class MongoDBOrganisationStorage implements OrganisationStorage {
    private organisationModel = DBconnHandler.getConn().model<Organisation>("organisation", organisationSchema);
    private idCounter : TotalCounter = new TotalCounter("organisation");

    async newOrganisation(org: Organisation): Promise<number>{
        org.id = (await this.idCounter.getCounterValue());
        await this.idCounter.incrementCounter();
        await this.organisationModel.create(org)
        return org.id;
    }

    async getOrganisationsByUser(userId: number): Promise<Organisation[]> {
        const organisations = await this.organisationModel.find({ 'members.userId': userId }).exec();
        return organisations;
    }
  
    async getAllOrganisations(): Promise<Organisation[]> {
        const organisations = await this.organisationModel.find().exec();
        return organisations;
    }
  
    async getOrganisationById(organisationId: number): Promise<Organisation | null> {
        const organisation = await this.organisationModel.findOne({id: organisationId}).exec();
        return organisation;
    }
  
    async updateOrganisation(org: Organisation): Promise<boolean> {
        await this.organisationModel.findOneAndUpdate({id: org.id}, org, { upsert: true, new: false}).exec();
        return true;
    }
  
    async deleteOrganisationById(organisationId: number): Promise<boolean> {
        await this.organisationModel.findOneAndDelete({id:organisationId}).exec();
        return true;
    }
}

export class MemoryOrganisationStorage implements OrganisationStorage {
    private organisations : Organisation[] = [];
    private idCounter : number = 0;

    async newOrganisation(org: Organisation) : Promise<number> {
        this.idCounter++;
        org.id = this.idCounter;
        this.organisations.push(org);
        return org.id;
    }

    async updateOrganisation(inOrg: Organisation): Promise<boolean> {
        let orgIndex : number | undefined= this.organisations.findIndex(orgElement => orgElement.id === inOrg.id)
        if (orgIndex !== -1) {
            this.organisations[orgIndex] = inOrg;
        }

        return true;
    }

    async deleteOrganisationById(organisationId: number): Promise<boolean> {
        this.organisations.splice(this.organisations.findIndex(org => org.id === organisationId) ,1)
        return true;
    }

    
    async getOrganisationsByUser(userId: number): Promise<Organisation[]> {
        let userOrgs : Organisation[] = []
        this.organisations.forEach(org => {
            org.members.forEach(member => {
                if (member.userId === userId) {
                    userOrgs.push(JSON.parse(JSON.stringify(org)));
                }
            });
        });

        return userOrgs;
    }

    async getAllOrganisations(): Promise<Organisation[]> {
        return JSON.parse(JSON.stringify(this.organisations));
    }
    
    async getOrganisationById(organisationId: number): Promise<Organisation | null> {
        try {
            return JSON.parse(JSON.stringify(this.organisations.find(org => org.id === organisationId)));      
        } catch (e : any) {
            return null;
        }
    }

}