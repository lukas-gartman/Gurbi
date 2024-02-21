
import { NewOrganisationData, Role, Organisation, Member } from "../model/organisationModels";
import {ServerModifierResponse, Permission} from "../model/dataModels"
import { log } from "console";


export class OrganisationService{

    //replace with mongoDB class
    private organisations : Organisation[] = [];

    //standard roles
    private readonly admin : Role = {roleName : "admin", permissions : this.getAvilabePermissionns()};
    private readonly member : Role = {roleName : "member", permissions : [] as Permission[]};
 

    private memberPermissionCheckHelper(organisationId : string, userId : string, checkPermission : Permission) : ServerModifierResponse{
        let organisation : Organisation | undefined = this.getOrganisation(organisationId);

        if(organisation === undefined){
            return ServerModifierResponse.GetServerModifierResponse(401); 
        }

        let member : Member | undefined = organisation.members.find(member => member.userId === userId);
        if(member === undefined){
            return ServerModifierResponse.GetServerModifierResponse(402);
        }

        let permission : Permission | undefined =  this.getMemberPermissions(userId, organisationId)?.find(permission => permission.permissionId === checkPermission.permissionId)
        if(permission === undefined){
            return ServerModifierResponse.GetServerModifierResponse(403);
        }

        return ServerModifierResponse.GetServerModifierResponse(201);
    }

    private updateOrganisation(org : Organisation){
        let orgIndex : number | undefined= this.organisations.findIndex(orgElement => orgElement.id === org.id)
        this.organisations[orgIndex] = org;
    }

    getUserOrganisations(userId : string) : Organisation[]{
        
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

    getOrganisations() : Organisation[]{
        return JSON.parse(JSON.stringify(this.organisations));
    }

    getOrganisation(organisationId : string) : Organisation | undefined{
        try {
            return JSON.parse(JSON.stringify(this.organisations.find(org => org.id === organisationId)));      
        } catch (error) {
            return undefined;
        }
      
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


        this.organisations.push({members : members, roles : roles, name : organisationName, id : "32e3d23dqwdw4et", picture:"wdaw"});

        return ServerModifierResponse.GetServerModifierResponse(200)

    }

    //Delete an organisation
    deleteOrginsitaion(userId : string, organisationId : string) : ServerModifierResponse{
        
        let checkedUserPremission : ServerModifierResponse = this.memberPermissionCheckHelper(organisationId, userId, Permission.getPermission(1))
        if(!checkedUserPremission.successState){
            return checkedUserPremission
        }
        
        this.organisations.splice(this.organisations.findIndex(org => org.id === organisationId) ,1)

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

        this.updateOrganisation(organisation);

        return ServerModifierResponse.GetServerModifierResponse(203); 

    }

    

    addRoleToOrganisation(userId : string, organisationId : string, role : Role) : ServerModifierResponse{    
        
        let checkedUserPremission : ServerModifierResponse = this.memberPermissionCheckHelper(organisationId, userId, Permission.getPermission(2))
        if(!checkedUserPremission.successState){
            return checkedUserPremission
        }

        for (let index = 0; index < role.permissions.length; index++) {
            const newPremission = role.permissions[index];
            let exsit : Permission | undefined = this.getAvilabePermissionns().find(permission => permission.permissionName === newPremission.permissionName);
            if(exsit === undefined){
                return ServerModifierResponse.GetServerModifierResponse(406);
            }
        }
        
        let org : Organisation = this.getOrganisation(organisationId) as Organisation;
        org.roles.push(role);

        this.updateOrganisation(org)
        
        return ServerModifierResponse.GetServerModifierResponse(204)
        

    }

    

    deleteRoleFromOrganistation(userId : string, organisationId : string, roleName : string) : ServerModifierResponse{
        
        let checkedUserPremission : ServerModifierResponse = this.memberPermissionCheckHelper(organisationId, userId,  Permission.getPermission(2))
        if(!checkedUserPremission.successState){
            return checkedUserPremission
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

        this.updateOrganisation(organisation);

        return ServerModifierResponse.GetServerModifierResponse(205);
    }

    changeRoleOfMember(userId : string, organisationId : string, targetMemberId : string, roleName : string) : ServerModifierResponse{
        let checkedUserPremission : ServerModifierResponse = this.memberPermissionCheckHelper(organisationId, userId, Permission.getPermission(2))
        if(!checkedUserPremission.successState){
            return checkedUserPremission;
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

        this.updateOrganisation(org);

        return  ServerModifierResponse.GetServerModifierResponse(206);

    }

}