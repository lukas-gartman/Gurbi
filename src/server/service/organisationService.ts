
import { NewOrganisationData, Permission, Role, Organisation, Member } from "../model/organisationModels";
import {ServerModifierResponse} from "../model/dataModels"
import { log } from "console";


export class OrganisationService{

    private organisations : Organisation[] = [];

    private permissions : string[] = ["ChangeOrginsationName", "DeleteOrganisation", "CreateNewEvent", "ChangeMemberRole", "RoleManipulator"];

    //standard roles
    private admin : Role = {roleName : "admin", permissions : this.getAvilabePermissionns()};
    private member : Role = {roleName : "member", permissions : [] as Permission[]};
 

    private memberPermissionCheckHelper(organisationId : string, userId : string, checkPermission : string) : ServerModifierResponse{
        let organisation : Organisation | undefined = this.getOrganisation(organisationId);

        if(organisation === undefined){
            return {successState: false, msg : "organisation does not exsit"}; 
        }

        let member : Member | undefined = organisation.organisationMembers.find(member => member.userId === userId);
        if(member === undefined){
            return {successState : false, msg: "not member in organisation"};
        }

        let permission : Permission | undefined =  member.role.permissions.find(permission => permission.permissionName === checkPermission);
        if(permission === undefined){
            return {successState : false, msg : "member does not have permission"};
        }

        return {successState : true, msg : "member does have permission"};
    }

    private updateOrganisation(org : Organisation){
        let orgIndex : number | undefined= this.organisations.findIndex(orgElement => orgElement.organisationId === org.organisationId)
        this.organisations[orgIndex] = org;
    }

    getUserOrganisations(userId : string) : Organisation[]{
        
        let userOrgs : Organisation[] = []
        this.organisations.forEach(org => {
            org.organisationMembers.forEach(member => {
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
            return JSON.parse(JSON.stringify(this.organisations.find(org => org.organisationId === organisationId)));      
        } catch (error) {
            return undefined;
        }
      
    }

    getAvilabePermissionns() : Permission[]{
        let permissions: Permission[] = [];
        this.permissions.forEach(element => {
            permissions.push({permissionName:element});
        });
        return permissions;
    }

    getMemberPermissions(userId : string, organisationId : string) : Role | undefined{
        let org : Organisation | undefined =  this.getOrganisation(organisationId);
        return org?.organisationMembers.find(member => member.userId === userId)?.role;
    }


    getOrganisationRoles(organisationId : string) : Role[] | undefined{
        let organisation : Organisation | undefined = this.getOrganisation(organisationId);
        return organisation?.organisationRoles;
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
        let members : Member[] = [{userId : creatorId, role : this.admin, nickName : creatorNickName}];


        this.organisations.push({organisationMembers : members, organisationRoles : roles, organisationName : organisationName, organisationId : "32e3d23dqwdw4et"});

        return {successState : true, msg : "organistation successfuly added"}

    }

    //Delete an organisation
    deleteOrginsitaion(userId : string, organisationId : string) : ServerModifierResponse{
        
        let checkedUserPremission : ServerModifierResponse = this.memberPermissionCheckHelper(organisationId, userId, "DeleteOrganisation")
        if(!checkedUserPremission.successState){
            return checkedUserPremission
        }
        
        this.organisations.splice(this.organisations.findIndex(org => org.organisationId === organisationId) ,1)

        return {successState : true, msg : "succesfuly deleted organisation"}
    }

    addMemberToOrganisation(userId : string, nickName : string, organisationId : string) : ServerModifierResponse{
        
        
        let organisation : Organisation | undefined = this.getOrganisation(organisationId);

        if(organisation === undefined){
            return {successState: false, msg : "organisation does not exsit"}; 
        }

        if(organisation.organisationMembers.find(member => member.userId === userId)){
            return {successState: false, msg : "user is already member in organisation"}; 
        }

        if(organisation.organisationMembers.find(member => member.nickName === nickName)){
            return {successState: false, msg : "nickName is already used in organisation"}; 
        }

        organisation.organisationMembers.push({userId : userId, nickName : nickName, role : this.member})

        this.updateOrganisation(organisation);

        return {successState: true, msg : "user added as member to organisation"}; 

    }

    

    addRoleToOrganisation(userId : string, organisationId : string, role : Role) : ServerModifierResponse{    
        
        let checkedUserPremission : ServerModifierResponse = this.memberPermissionCheckHelper(organisationId, userId, "RoleManipulator")
        if(!checkedUserPremission.successState){
            return checkedUserPremission
        }

        for (let index = 0; index < role.permissions.length; index++) {
            const newPremission = role.permissions[index];
            let exsit : Permission | undefined = this.getAvilabePermissionns().find(permission => permission.permissionName === newPremission.permissionName);
            if(exsit === undefined){
                return {successState : false, msg: newPremission.permissionName + " is not an available premission"};
            }
        }
        
        let org : Organisation = this.getOrganisation(organisationId) as Organisation;
        org.organisationRoles.push(role);

        this.updateOrganisation(org)
        
        return {successState : true, msg: "role added to organisation"}
        

    }

    

    deleteRoleFromOrganistation(userId : string, organisationId : string, roleName : string) : ServerModifierResponse{
        
        let checkedUserPremission : ServerModifierResponse = this.memberPermissionCheckHelper(organisationId, userId, "RoleManipulator")
        if(!checkedUserPremission.successState){
            return checkedUserPremission
        }


        if(this.member.roleName === roleName){
            return {successState : false, msg : "cant delete this role"};
        }

        if(this.admin.roleName === roleName){
            return {successState : false, msg : "cant delete this role"};
        }

        let organisation : Organisation = this.getOrganisation(organisationId) as Organisation;

        let index : number = organisation.organisationRoles.findIndex(role => role.roleName === roleName)

        // make members with role to only have the role member.
        if (index !== -1){
            organisation.organisationRoles.splice(index, 1)
            organisation.organisationMembers.forEach(member => {
                if(member.role.roleName === roleName){
                    member.role = this.member;
                }
            });
        }

        this.updateOrganisation(organisation);

        return {successState : true, msg : "role has been deleted from organisation"};
    }

    changeRoleOfMember(userId : string, organisationId : string, targetMemberId : string, roleName : string) : ServerModifierResponse{
        let checkedUserPremission : ServerModifierResponse = this.memberPermissionCheckHelper(organisationId, userId, "RoleManipulator")
        if(!checkedUserPremission.successState){
            return checkedUserPremission;
        }
    
        let org : Organisation = this.getOrganisation(organisationId) as Organisation;

        
        let role : Role | undefined =  org.organisationRoles.find(roleElement => roleElement.roleName === roleName)
        if(role === undefined){
            return {successState : false, msg : "role does not exsist in organisation"};
        }

        let index : number | undefined = org.organisationMembers.findIndex(member => member.userId === targetMemberId);
        if (index === -1){
            return {successState : false, msg : "target member does not exsist in organisation"};
        }

        org.organisationMembers[index].role = role;

        this.updateOrganisation(org);

        return  {successState : true, msg : "changed target member's role"};

    }

}