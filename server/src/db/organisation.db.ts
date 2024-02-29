import {Schema} from 'mongoose';
import { Organisation } from '../model/organisationModels';
import TotalCounter, { DBconnHandler } from './database';


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




//storage
export interface OrganisationStorageHandler {
    getOrganisationsByUser(userId: string): Promise<Organisation[]>;
  
    getAllOrganisations(): Promise<Organisation[]>;
  
    getOrganisationById(organisationId: string): Promise<Organisation | null>;
  
    updateOrganisation(org: Organisation): Promise<boolean>;

    newOrganisation(org: Organisation): void;
  
    deleteOrganisationById(organisationId: string): Promise<boolean>;
  }

  //need try catch
export class MongoDBOrganisationStorageHandler implements OrganisationStorageHandler {

    private organisationModel = DBconnHandler.getConn().model<Organisation>("organisation", organisationSchema);

    private idCounter : TotalCounter = new TotalCounter("organisation");


    async newOrganisation(org: Organisation){
        org.id = (await this.idCounter.getCounterValue()).toString();
        await this.idCounter.incrementCounter();
        await this.organisationModel.create(org)
    }

    async getOrganisationsByUser(userId: string): Promise<Organisation[]> {
        const organisations = await this.organisationModel.find({ 'members.userId': userId }).exec();
        return organisations;
    }
  
    async getAllOrganisations(): Promise<Organisation[]> {
        const organisations = await this.organisationModel.find().exec();
        return organisations;
    }
  
    async getOrganisationById(organisationId: string): Promise<Organisation | null> {
        const organisation = await this.organisationModel.findOne({id: organisationId}).exec();
        return organisation;
    }
  
    async updateOrganisation(org: Organisation): Promise<boolean> {
        await this.organisationModel.findOneAndUpdate({id:org.id}, org, { upsert: true, new: false}).exec();
        return true;
    }
  
    async deleteOrganisationById(organisationId: string): Promise<boolean> {
        await this.organisationModel.findOneAndDelete({id:organisationId}).exec();
        return true;
    }
  }


export class MemoryOrganisationStorageHandler implements OrganisationStorageHandler{

    private organisations : Organisation[] = [];
    private idCounter : number = 0;

    async newOrganisation(org: Organisation){
        this.idCounter++;
        org.id = this.idCounter.toString();
        this.organisations.push(org);
    }

    async updateOrganisation(inOrg: Organisation): Promise<boolean> {

        let orgIndex : number | undefined= this.organisations.findIndex(orgElement => orgElement.id === inOrg.id)

        if(orgIndex !== -1){
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