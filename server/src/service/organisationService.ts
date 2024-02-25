
import { NewOrganisationData, Role, Organisation, Member, OrganisationStorageHandler, MemoryOrganisationStorageHandler} from "../model/organisationModels";
import {ServerModifierResponse, Permission} from "../model/dataModels"
import { log } from "console";

function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

export class OrganisationService{

    //replace with mongoDB class


    private organisationStorage : OrganisationStorageHandler;

    //standard roles
    private readonly admin : Role = {roleName : "admin", permissions : this.getAvilabePermissionns()};
    private readonly member : Role = {roleName : "member", permissions : [] as Permission[]};
    

     constructor (useDatabase : boolean){

        if(useDatabase){
            this.organisationStorage = new MemoryOrganisationStorageHandler()
        }
        else{
            this.organisationStorage = new MemoryOrganisationStorageHandler()
        }
        
     }

    private memberPermissionCheckHelper(organisationId : string, userId : string, checkPermission : Permission) : {serverRes:ServerModifierResponse, succes:boolean}{
        let organisation : Organisation | undefined = this.getOrganisation(organisationId);

        if(organisation === undefined){
            return {serverRes:ServerModifierResponse.GetServerModifierResponse(401), succes: false }; 
        }

        let member : Member | undefined = organisation.members.find(member => member.userId === userId);
        if(member === undefined){
            return {serverRes:ServerModifierResponse.GetServerModifierResponse(402), succes: false };
        }

        let permission : Permission | undefined =  this.getMemberPermissions(userId, organisationId)?.find(permission => permission.permissionId === checkPermission.permissionId)
        if(permission === undefined){
            return {serverRes:ServerModifierResponse.GetServerModifierResponse(403), succes: false };
        }

        return {serverRes:ServerModifierResponse.GetServerModifierResponse(201), succes: true};
    }


    getUserOrganisations(userId : string) : Organisation[]{
        return this.organisationStorage.getOrganisationsByUser(userId);
    }

    getOrganisations() : Organisation[]{
        return this.organisationStorage.getAllOrganisations();
    }

    getOrganisation(organisationId : string) : Organisation | undefined{
        return this.organisationStorage.getOrganisationById(organisationId);
    }

    getAvilabePermissionns() : Permission[]{
        return Permission.getAllPermissions();
    }


    
    getMemberPermissions(userId : string, organisationId : string) : Permission[] | undefined{
        let org : Organisation | undefined =  this.getOrganisation(organisationId);
        let roleName : string | undefined = org?.members.find(member => member.userId === userId)?.roleName;
        
        try {
            return JSON.parse(JSON.stringify(org?.roles.find(role => role.roleName === roleName)?.permissions));
        } catch (error) {
            return undefined;    
        }

        
    }



    //Create new organisation 
    addOrganisation(newOrgData : NewOrganisationData) : ServerModifierResponse{
        let roles : Role[] = newOrgData.roles;
        let creatorId : string = newOrgData.creatorId;
        let creatorNickName : string = newOrgData.creatorNickName;
        let organisationName : string = newOrgData.orgName;

        //add admin and member roles per default
        roles.push(this.admin);
        roles.push(this.member);

        //creator added as admin per default
        let members : Member[] = [{userId : creatorId, roleName : this.admin.roleName, nickName : creatorNickName}];


        let id : string;
        while(true){
            let testId : string = getRandomInt(0, 10000000000).toString();
            if(this.getOrganisation(testId) === undefined){
                id = testId;
                break;
            }
        }
        
        this.organisationStorage.postOrganisation({members : members, roles : roles, name : organisationName, id : id, picture:"wdaw"});

        return ServerModifierResponse.GetServerModifierResponse(200)

    }

    //Delete an organisation
    deleteOrginsitaion(userId : string, organisationId : string) : ServerModifierResponse{
        
        let checkedUserPremission : {serverRes:ServerModifierResponse, succes:boolean} = this.memberPermissionCheckHelper(organisationId, userId, Permission.getPermission(1))
        if(!checkedUserPremission.succes){
            return checkedUserPremission.serverRes;
        }
        
        this.organisationStorage.deleteOrganisationById(organisationId);

        return ServerModifierResponse.GetServerModifierResponse(202)
    }

    addMemberToOrganisation(userId : string, nickName : string, organisationId : string) : ServerModifierResponse{
        
        
        let organisation : Organisation | undefined = this.getOrganisation(organisationId);

        if(organisation === undefined){
            return ServerModifierResponse.GetServerModifierResponse(401)
        }

        if(organisation.members.find(member => member.userId === userId)){
            return ServerModifierResponse.GetServerModifierResponse(404)
        }

        if(organisation.members.find(member => member.nickName === nickName)){
            return ServerModifierResponse.GetServerModifierResponse(405)
        }

        organisation.members.push({userId : userId, nickName : nickName, roleName : this.member.roleName})

        this.organisationStorage.postOrganisation(organisation);

        return ServerModifierResponse.GetServerModifierResponse(203); 

    }

    

    addRoleToOrganisation(userId : string, organisationId : string, role : Role) : ServerModifierResponse{    
        
        let checkedUserPremission : {serverRes:ServerModifierResponse, succes:boolean} = this.memberPermissionCheckHelper(organisationId, userId, Permission.getPermission(2))
        if(!checkedUserPremission.succes){
            return checkedUserPremission.serverRes
        }



        for (let index = 0; index < role.permissions.length; index++) {
            const newPremission = role.permissions[index];
            let exsit : Permission | undefined = this.getAvilabePermissionns().find(permission => permission.permissionName === newPremission.permissionName);
            if(exsit === undefined){
                return ServerModifierResponse.GetServerModifierResponse(406);
            }
        }

        if (this.getOrganisation(organisationId)?.roles.find(orgRole => orgRole.roleName === role.roleName) !== undefined){
            return ServerModifierResponse.GetServerModifierResponse(410);
        }
        
        let org : Organisation = this.getOrganisation(organisationId) as Organisation;
        org.roles.push(role);
        
        this.organisationStorage.postOrganisation(org);
        
        return ServerModifierResponse.GetServerModifierResponse(204)
        

    }

    

    deleteRoleFromOrganistation(userId : string, organisationId : string, roleName : string) : ServerModifierResponse{
        
        let checkedUserPremission : {serverRes:ServerModifierResponse, succes:boolean} = this.memberPermissionCheckHelper(organisationId, userId, Permission.getPermission(2))
        if(!checkedUserPremission.succes){
            return checkedUserPremission.serverRes
        }

        if(this.member.roleName === roleName){
            return ServerModifierResponse.GetServerModifierResponse(407);
        }

        if(this.admin.roleName === roleName){
            return ServerModifierResponse.GetServerModifierResponse(407);
        }

        let organisation : Organisation = this.getOrganisation(organisationId) as Organisation;

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

        this.organisationStorage.postOrganisation(organisation);

        return ServerModifierResponse.GetServerModifierResponse(205);
    }

    changeRoleOfMember(userId : string, organisationId : string, targetMemberId : string, roleName : string) : ServerModifierResponse{
        let checkedUserPremission : {serverRes:ServerModifierResponse, succes:boolean} = this.memberPermissionCheckHelper(organisationId, userId, Permission.getPermission(2))
        if(!checkedUserPremission.succes){
            return checkedUserPremission.serverRes
        }
    
        let org : Organisation = this.getOrganisation(organisationId) as Organisation;

        
        let role : Role | undefined =  org.roles.find(roleElement => roleElement.roleName === roleName)
        if(role === undefined){
            return ServerModifierResponse.GetServerModifierResponse(408);
        }

        let index : number | undefined = org.members.findIndex(member => member.userId === targetMemberId);
        if (index === -1){
            return ServerModifierResponse.GetServerModifierResponse(409);
        }

        org.members[index].roleName = role.roleName;

        this.organisationStorage.postOrganisation(org);

        return  ServerModifierResponse.GetServerModifierResponse(206);

    }

}