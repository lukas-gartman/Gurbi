
import { NewOrganisationData, Role, Organisation, Member, OrganisationStorageHandler, MemoryOrganisationStorageHandler} from "../model/organisationModels";
import {ServerModifierResponse, Permission} from "../model/dataModels"
import { log } from "console";



export class OrganisationService{

    //replace with mongoDB class


    private organisationStorage : OrganisationStorageHandler;

    //standard roles
    private readonly admin : Role = {roleName : "admin", permissions : Permission.getAllPermissions()};
    private readonly member : Role = {roleName : "member", permissions : [] as Permission[]};
    

     constructor (useDatabase : boolean){

        if(useDatabase){
            this.organisationStorage = new MemoryOrganisationStorageHandler()
        }
        else{
            this.organisationStorage = new MemoryOrganisationStorageHandler()
        }
        
     }

    private async memberPermissionCheckHelper(organisationId : string, userId : string, checkPermission : Permission) : Promise<{ serverRes: ServerModifierResponse; succes: boolean; }>{
        let organisation : Organisation | null = await this.organisationStorage.getOrganisationById(organisationId);

        if(organisation === null){
            return {serverRes:ServerModifierResponse.GetServerModifierResponse(401), succes: false }; 
        }

        let member : Member | undefined = organisation.members.find(member => member.userId === userId);
        if(member === undefined){
            return {serverRes:ServerModifierResponse.GetServerModifierResponse(402), succes: false };
        }


        let roleName : string | undefined = organisation?.members.find(member => member.userId === userId)?.roleName;

        let permission : Permission | undefined =  organisation?.roles.find(role => role.roleName === roleName)?.permissions?.find(permission => permission.permissionId === checkPermission.permissionId)
        if(permission === undefined){
            return {serverRes:ServerModifierResponse.GetServerModifierResponse(403), succes: false };
        }

        return {serverRes:ServerModifierResponse.GetServerModifierResponse(201), succes: true};
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

    async getMemberPermissions(userId : string, organisationId : string) : Promise<Permission[] | undefined>{
        let organisation : Organisation | null = await this.organisationStorage.getOrganisationById(organisationId);
        let roleName : string | undefined = organisation?.members.find(member => member.userId === userId)?.roleName;
        return organisation?.roles.find(role => role.roleName === roleName)?.permissions
    }


    //Create new organisation 
    async addOrganisation(newOrgData : NewOrganisationData) : Promise<ServerModifierResponse>{

    

        let roles : Role[] = newOrgData.roles;
        let creatorId : string = newOrgData.creatorId;
        let creatorNickName : string = newOrgData.creatorNickName;
        let organisationName : string = newOrgData.orgName;

        //add admin and member roles per default
        roles.push(this.admin);
        roles.push(this.member);

        //creator added as admin per default
        let members : Member[] = [{userId : creatorId, roleName : this.admin.roleName, nickName : creatorNickName}];

        await this.organisationStorage.postOrganisation({members : members, roles : roles, name : organisationName, id : "adawdawdawdawd", picture:"wdaw"});

        return ServerModifierResponse.GetServerModifierResponse(200)

    }

    //Delete an organisation
    async deleteOrginsitaion(userId : string, organisationId : string) : Promise<ServerModifierResponse>{
        
        let checkedUserPremission : {serverRes:ServerModifierResponse, succes:boolean} = await this.memberPermissionCheckHelper(organisationId, userId, Permission.getPermission(1))
        if(!checkedUserPremission.succes){
            return checkedUserPremission.serverRes;
        }
        
        await this.organisationStorage.deleteOrganisationById(organisationId);

        return ServerModifierResponse.GetServerModifierResponse(202)
    }

    async addMemberToOrganisation(userId : string, nickName : string, organisationId : string) : Promise<ServerModifierResponse>{
        
        
        let organisation : Organisation | null = await this.organisationStorage.getOrganisationById(organisationId);

        if(organisation === null){
            return ServerModifierResponse.GetServerModifierResponse(401)
        }

        if(organisation.members.find(member => member.userId === userId)){
            return ServerModifierResponse.GetServerModifierResponse(404)
        }

        if(organisation.members.find(member => member.nickName === nickName)){
            return ServerModifierResponse.GetServerModifierResponse(405)
        }

        organisation.members.push({userId : userId, nickName : nickName, roleName : this.member.roleName})

        await this.organisationStorage.postOrganisation(organisation);

        return ServerModifierResponse.GetServerModifierResponse(203); 

    }

    

    async addRoleToOrganisation(userId : string, organisationId : string, role : Role) : Promise<ServerModifierResponse>{    
        
        let checkedUserPremission : {serverRes:ServerModifierResponse, succes:boolean} = await this.memberPermissionCheckHelper(organisationId, userId, Permission.getPermission(2))
        if(!checkedUserPremission.succes){
            return checkedUserPremission.serverRes
        }



        for (let index = 0; index < role.permissions.length; index++) {
            const newPremission = role.permissions[index];
            let exsit : Permission | undefined = Permission.getAllPermissions().find(permission => permission.permissionName === newPremission.permissionName);
            if(exsit === undefined){
                return ServerModifierResponse.GetServerModifierResponse(406);
            }
        }
        
        let organisation : Organisation = await this.organisationStorage.getOrganisationById(organisationId) as Organisation

        if (organisation.roles.find(orgRole => orgRole.roleName === role.roleName) !== undefined){
            return ServerModifierResponse.GetServerModifierResponse(410);
        }
        
        
        organisation.roles.push(role);
        
        await this.organisationStorage.postOrganisation(organisation);
        
        return ServerModifierResponse.GetServerModifierResponse(204)
        

    }

    

    async deleteRoleFromOrganistation(userId : string, organisationId : string, roleName : string) : Promise<ServerModifierResponse>{
        
        let checkedUserPremission : {serverRes:ServerModifierResponse, succes:boolean} = await this.memberPermissionCheckHelper(organisationId, userId, Permission.getPermission(2))
        if(!checkedUserPremission.succes){
            return checkedUserPremission.serverRes
        }

        if(this.member.roleName === roleName){
            return ServerModifierResponse.GetServerModifierResponse(407);
        }

        if(this.admin.roleName === roleName){
            return ServerModifierResponse.GetServerModifierResponse(407);
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

        await this.organisationStorage.postOrganisation(organisation);

        return ServerModifierResponse.GetServerModifierResponse(205);
    }

    async changeRoleOfMember(userId : string, organisationId : string, targetMemberId : string, roleName : string) : Promise<ServerModifierResponse>{
        let checkedUserPremission : {serverRes:ServerModifierResponse, succes:boolean} = await this.memberPermissionCheckHelper(organisationId, userId, Permission.getPermission(2))
        if(!checkedUserPremission.succes){
            return checkedUserPremission.serverRes
        }
    
        let org : Organisation = await this.organisationStorage.getOrganisationById(organisationId) as Organisation

        
        let role : Role | undefined =  org.roles.find(roleElement => roleElement.roleName === roleName)
        if(role === undefined){
            return ServerModifierResponse.GetServerModifierResponse(408);
        }

        let index : number | undefined = org.members.findIndex(member => member.userId === targetMemberId);
        if (index === -1){
            return ServerModifierResponse.GetServerModifierResponse(409);
        }

        org.members[index].roleName = role.roleName;

        await this.organisationStorage.postOrganisation(org);

        return  ServerModifierResponse.GetServerModifierResponse(206);

    }

}