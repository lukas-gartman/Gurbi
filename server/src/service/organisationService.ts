
import { NewOrganisationData, Role, Organisation, Member, OrganisationUser} from "../model/organisationModels";
import {OrganisationPermissionChecker, Permission, ServiceResponse, getAllPermissions} from "../model/dataModels"
import { OrgServiceResponse } from "../model/organisationModels";
import { MemoryOrganisationStorage, MongoDBOrganisationStorage, OrganisationStorage } from "../db/organisation.db";
import { EventStorage } from "../db/event.db";
import { Event, NewEventDTO } from "../model/eventModels";




export class OrganisationService{

    //replace with mongoDB class


    private organisationStorage : OrganisationStorage;


    private organisationPermissionChecker : OrganisationPermissionChecker;

    //standard roles
    private readonly admin : Role = {roleName : "admin", permissions : getAllPermissions()};
    private readonly member : Role = {roleName : "member", permissions : [] as Permission[]};
    

     constructor (organisationStorage : OrganisationStorage){
        this.organisationStorage = organisationStorage;
        this.organisationPermissionChecker = new OrganisationPermissionChecker(organisationStorage);
     }


    async getUserOrganisations(userId : string) : Promise<Organisation[]>{
        return await this.organisationStorage.getOrganisationsByUser(userId);
    }

    async getOrganisations() : Promise<Organisation[]>{
        return await this.organisationStorage.getAllOrganisations();
    }

    async getOrganisation(organisationId : string) : Promise<Organisation | null>{
        return await this.organisationStorage.getOrganisationById(organisationId);
    }

    async getMemberPermissions(orguser : OrganisationUser) : Promise<Permission[]>{
        let organisation : Organisation | null = await this.organisationStorage.getOrganisationById(orguser.organisationId);

        let roleName : string | undefined = organisation?.members.find(member => member.userId === orguser.userId)?.roleName;

        let premissions : Permission[] | undefined = organisation?.roles.find(role => role.roleName === roleName)?.permissions

        if(premissions === undefined){
            return [] as Permission[];
        }
        else{
            return premissions;
        }

        
    }


    //Create new organisation 
    async addOrganisation(newOrgData : NewOrganisationData) : Promise<ServiceResponse>{

    

        let roles : Role[] = newOrgData.roles;
        let creatorId : string = newOrgData.creatorId;
        let creatorNickName : string = newOrgData.creatorNickName;
        let organisationName : string = newOrgData.orgName;

        //add admin and member roles per default
        roles.push(this.admin);
        roles.push(this.member);

        //creator added as admin per default
        let members : Member[] = [{userId : creatorId, roleName : this.admin.roleName, nickName : creatorNickName}];

        this.organisationStorage.newOrganisation({members : members, roles : roles, name : organisationName, id : "0", picture:"wdaw"});

        return OrgServiceResponse.getResponse(200)

    }

    //Delete an organisation
    async deleteOrganisation(userId : string, organisationId : string) : Promise<ServiceResponse>{
        
        let checkedUserPremission : {serverRes:ServiceResponse, succes:boolean} = await this.organisationPermissionChecker.memberPermissionCheck(organisationId, userId, Permission.DeleteOrganisation)
        if(!checkedUserPremission.succes){
            return checkedUserPremission.serverRes;
        }
        
        await this.organisationStorage.deleteOrganisationById(organisationId);

        return OrgServiceResponse.getResponse(202)
    }

    async addMemberToOrganisation(userId : string, nickName : string, organisationId : string) : Promise<ServiceResponse>{
        
        
        let organisation : Organisation | null = await this.organisationStorage.getOrganisationById(organisationId);

        if(organisation === null){
            return OrgServiceResponse.getResponse(401)
        }

        if(organisation.members.find(member => member.userId === userId)){
            return OrgServiceResponse.getResponse(404)
        }

        if(organisation.members.find(member => member.nickName === nickName)){
            return OrgServiceResponse.getResponse(405)
        }

        organisation.members.push({userId : userId, nickName : nickName, roleName : this.member.roleName})

        await this.organisationStorage.updateOrganisation(organisation);

        return OrgServiceResponse.getResponse(203); 

    }

    async removeMemberFromOrganisation(userId : string, organisationId : string) : Promise<ServiceResponse>{
        
        let organisation : Organisation | null = await this.organisationStorage.getOrganisationById(organisationId);
        
        if(organisation === null){
            return OrgServiceResponse.getResponse(401);
        }

        let index : number = organisation.members.findIndex(member => member.userId === userId);
        if(index === -1){
            return OrgServiceResponse.getResponse(402);
        }

        organisation.members.splice(index, 1);

        await this.organisationStorage.updateOrganisation(organisation);

        return OrgServiceResponse.getResponse(207);
    }

    async addRoleToOrganisation(userId : string, organisationId : string, role : Role) : Promise<ServiceResponse>{    
        
        let checkedUserPremission : {serverRes:ServiceResponse, succes:boolean} = await this.organisationPermissionChecker.memberPermissionCheck(organisationId, userId, Permission.RoleManipulator)
        if(!checkedUserPremission.succes){
            return checkedUserPremission.serverRes
        }



        for (let index = 0; index < role.permissions.length; index++) {
            const newPremission = role.permissions[index];
            let exsit : Permission | undefined = getAllPermissions().find(permission => permission === newPremission);
            if(exsit === undefined){
                return OrgServiceResponse.getResponse(406);
            }
        }
        
        let organisation : Organisation = await this.organisationStorage.getOrganisationById(organisationId) as Organisation

        if (organisation.roles.find(orgRole => orgRole.roleName === role.roleName) !== undefined){
            return OrgServiceResponse.getResponse(410);
        }
        
        
        organisation.roles.push(role);
        
        await this.organisationStorage.updateOrganisation(organisation);
        
        return OrgServiceResponse.getResponse(204)
        

    }

    

    async deleteRoleFromOrganistation(userId : string, organisationId : string, roleName : string) : Promise<ServiceResponse>{
        
        let checkedUserPremission : {serverRes:ServiceResponse, succes:boolean} = await this.organisationPermissionChecker.memberPermissionCheck(organisationId, userId, Permission.RoleManipulator)
        if(!checkedUserPremission.succes){
            return checkedUserPremission.serverRes
        }

        if(this.member.roleName === roleName){
            return OrgServiceResponse.getResponse(407);
        }

        if(this.admin.roleName === roleName){
            return OrgServiceResponse.getResponse(407);
        }

        let organisation : Organisation =  await this.organisationStorage.getOrganisationById(organisationId) as Organisation

        let index : number = organisation.roles.findIndex(role => role.roleName === roleName)

        // make members with role to only have the role member.
        if (index !== -1){
            organisation.roles.splice(index, 1)
            organisation.members.forEach(member => {
                if(member.roleName === roleName){
                    member.roleName = this.member.roleName;
                }
            });
        }

        await this.organisationStorage.updateOrganisation(organisation);

        return OrgServiceResponse.getResponse(205);
    }

    async changeRoleOfMember(userId : string, organisationId : string, targetMemberId : string, roleName : string) : Promise<ServiceResponse>{
        let checkedUserPremission : {serverRes:ServiceResponse, succes:boolean} = await this.organisationPermissionChecker.memberPermissionCheck(organisationId, userId, Permission.RoleManipulator)
        if(!checkedUserPremission.succes){
            return checkedUserPremission.serverRes
        }
    
        let org : Organisation = await this.organisationStorage.getOrganisationById(organisationId) as Organisation

        
        let role : Role | undefined =  org.roles.find(roleElement => roleElement.roleName === roleName)
        if(role === undefined){
            return OrgServiceResponse.getResponse(408);
        }

        let index : number | undefined = org.members.findIndex(member => member.userId === targetMemberId);
        if (index === -1){
            return OrgServiceResponse.getResponse(409);
        }

        org.members[index].roleName = role.roleName;

        await this.organisationStorage.updateOrganisation(org);

        return  OrgServiceResponse.getResponse(206);

    }

}