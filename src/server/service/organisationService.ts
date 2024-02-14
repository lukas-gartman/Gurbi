
import { NewOrganisationData, Permission, Role, Organisation, Member } from "../model/organisationModels";
import {ServerModifierResponse} from "../model/dataModels"
import { log } from "console";


export class OrganisationService{

    private organisations : Organisation[] = [];

    private permissions : string[] = ["ChangeOrginsationName", "DeleteOrganisation", "CreateNewEvent", "ChangeMemberRole", "AddRole"];

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

        //find user role
        let memberRole : Role | undefined = this.getMemberPermissions(userId, organisationId)
        if(memberRole === undefined){
            return {successState : false, msg : "not member in organisation, or organisation does not exsist"}
        }


        //if user has a role that contains 'DeleteOrganisation' permissionn
        if (memberRole.permissions.some(permission => permission.permissionName === "DeleteOrganisation")){
            //remove organisation from memmory
            this.organisations.splice(this.organisations.findIndex(org => org.organisationId === organisationId) ,1)

            return {successState : true, msg : "succesfuly deleted organisation"}
        }

        return {successState: false, msg : "member does not have permission to delete organisation"};
    }

    addMemberToOrganisation(userId : string, nickName : string, inOrganisationId : string) : ServerModifierResponse{
        
        
        let organisation : Organisation | undefined = this.organisations.find(org => org.organisationId === inOrganisationId);

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


}