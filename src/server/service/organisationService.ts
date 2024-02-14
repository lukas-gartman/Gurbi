
import { NewOrganisationData, Permission, Role, Organisation, Member } from "../model/organisationModels";
import {ServerModifierResponse} from "../model/dataModels"
import { log } from "console";


export class OrganisationService{

    private organisations : Organisation[] = [];

    private permissions : string[] = ["ChangeOrginsationName", "DeleteOrganisation", "CreateNewEvent", "ChangeMemberRole", "RoleManipulator"];

    //standard roles
    private admin : Role = {roleName : "admin", permissions : this.getAvilabePermissionns()};
    private member : Role = {roleName : "member", permissions : [] as Permission[]};

    getUserOrganisations(userId : string) : Organisation[]{
        
        let userOrgs : Organisation[] = []
        this.organisations.forEach(org => {
            org.organisationMembers.forEach(member => {
                if(member.userId === userId){
                    userOrgs.push(org)
                }
            });
        });

        return userOrgs;
    }

    getOrganisations() : Organisation[]{
        return this.organisations;
    }

    getOrganisation(organisationId : string) : Organisation | undefined{
        return this.organisations.find(org => org.organisationId === organisationId);
    }

    getAvilabePermissionns() : Permission[]{
        let permissions: Permission[] = [];
        this.permissions.forEach(element => {
            permissions.push({permissionName:element});
        });
        return permissions;
    }

    getMemberPermissions(userId : string, organisationId : string) : Role | undefined{
        let org : Organisation | undefined =  this.organisations.find(org => org.organisationId === organisationId);
        return org?.organisationMembers.find(member => member.userId === userId)?.role;
    }

    getOrganisationMembers(organisationId : string) : Member[]{

        
        let org : Organisation =  this.organisations.find(org => org.organisationId === organisationId) as Organisation;

        let members : Member[] = []
        org.organisationMembers.forEach(member => {
            members.push(member)
        });

        return members;
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
        let organisation : Organisation | undefined = this.organisations.find(org => org.organisationId === organisationId);

        if(organisation === undefined){
            return {successState: false, msg : "organisation does not exsit"}; 
        }

        let member : Member | undefined = organisation.organisationMembers.find(member => member.userId === userId);
        if(member === undefined){
            return {successState : false, msg: "not member in organisation"};
        }

        
        let permission : Permission | undefined =  member.role.permissions.find(permission => permission.permissionName === "RoleManipulator");
        if(permission === undefined){
            return {successState : false, msg : "member does not have permission to delete organisation"};
        }

        this.organisations.splice(this.organisations.findIndex(org => org.organisationId === organisationId) ,1)

        return {successState : true, msg : "succesfuly deleted organisation"}
    }

    addMemberToOrganisation(userId : string, nickName : string, organisationId : string) : ServerModifierResponse{
        
        
        let organisation : Organisation | undefined = this.organisations.find(org => org.organisationId === organisationId);

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
        return {successState: true, msg : "user added as member to organisation"}; 

    }

    addRoleToOrganisation(userId : string, organisationId : string, role : Role) : ServerModifierResponse{    
        let organisation : Organisation | undefined = this.organisations.find(org => org.organisationId === organisationId);
        if(organisation === undefined){
            return {successState : false, msg: "organisation does not exsit"};
        }
        let member : Member | undefined = organisation.organisationMembers.find(member => member.userId === userId);
        if(member === undefined){
            return {successState : false, msg: "not member in organisation"};
        }

        let permission : Permission | undefined =  member.role.permissions.find(permission => permission.permissionName === "RoleManipulator");
        if(permission === undefined){
            return {successState : false, msg : "member does not have permission to add roles"};
        }

        for (let index = 0; index < role.permissions.length; index++) {
            const newPremission = role.permissions[index];
            let exsit : Permission | undefined = this.getAvilabePermissionns().find(permission => permission.permissionName === newPremission.permissionName);
            if(exsit === undefined){
                return {successState : false, msg: newPremission.permissionName + " is not an available premission"};
            }
        }

        organisation.organisationRoles.push(role);
        return {successState : true, msg: "role added to organisation"}
        

    }

    deleteRoleFromOrganistation(userId : string, organisationId : string, roleName : string) : ServerModifierResponse{
        let organisation : Organisation | undefined = this.organisations.find(org => org.organisationId === organisationId);
        if(organisation === undefined){
            return {successState : false, msg: "organisation does not exsit"};
        }

        let member : Member | undefined = organisation.organisationMembers.find(member => member.userId === userId);
        if(member === undefined){
            return {successState : false, msg: "not member in organisation"};
        }

        let permission : Permission | undefined =  member.role.permissions.find(permission => permission.permissionName === "RoleManipulator");
        if(permission === undefined){
            return {successState : false, msg : "member does not have permission to delete roles"};
        }

        if(this.member.roleName === roleName){
            return {successState : false, msg : "cant delete this role"};
        }

        if(this.admin.roleName === roleName){
            return {successState : false, msg : "cant delete this role"};
        }

        let index : number = organisation.organisationRoles.findIndex(role => role.roleName === roleName)

        // make members with role to only have the role member.
        if (index !== -1){
            organisation.organisationRoles.splice(index, 1)
            organisation.organisationMembers.forEach(member => {
                if(member.role.roleName === roleName){
                    member.role = this.member
                }
            });
        }

        return {successState : true, msg : "role has been deleted from organisation"};
    }

}