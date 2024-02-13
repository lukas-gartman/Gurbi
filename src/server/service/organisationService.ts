
import { NewOrganisationData, Permission, Role, Organisation, Member } from "../model/organisationModels";
import {ServerModifierResponse} from "../model/dataModels"


export class OrganisationService{

    private organisations : Organisation[] = [];

    private permissions : string[] = ["ChangeOrginsationName", "DeleteOrginsitaion", "CreateNewEvent", "ChangeMemberRole", "AddRole"];

    

    getAvilabePermissionns() : Permission[]{
        let permissions : Permission[] = [];
        this.permissions.forEach(element => {
            permissions.push({permissionName:element});
        });
        return permissions;
    }

    getMemberPermissionns(userId : string, organisationId : string) : Role | undefined{
        let org : Organisation | undefined =  this.organisations.find(org => org.organisationId === organisationId);
        return org?.organisationMembers.find(member => member.userId === userId)?.role;
    }


    //Create new organisation 
    addOrganisation(newOrgData : NewOrganisationData) : ServerModifierResponse{
        let roles : Role[] = newOrgData.roles;
        let creatorId : string = newOrgData.creatorId;
        let creatorNickName : string = newOrgData.creatorNickName;
        let organisationName : string = newOrgData.orgName;


        const permissionEntries: Permission[] = this.getAvilabePermissionns()
        
        //admin role added per default
        let admin : Role = {roleName : "admin", permissions : permissionEntries};
        roles.push(admin);

        //creator added as admin per default
        let members : Member[] = [{userId : creatorId, role : admin, nickName : creatorNickName}];


        this.organisations.push({organisationMembers : members, organisationRoles : roles, organisationName : organisationName, organisationId : "32e3d23dqwdw4et"});

        return {successState : true, msg : "organistation successfuly added"}

    }

    //Organisation operation requset
    deleteOrginsitaion(userId : string, organisationId : string) : ServerModifierResponse{

        //find user role
        let memberRole : Role | undefined = this.getMemberPermissionns(userId, organisationId)
        if(memberRole === undefined){
            return {successState : false, msg : "not member in organisation, or organisation does not exsist"}
        }


        //if user has a role that contains 'DeleteOrginsitaion' permissionn
        if(memberRole.permissions.some(permission => permission.permissionName === "DeleteOrginsitaion")){
            //remove organisation from memmory
            //this.organisations.splice(this.organisations.findIndex(org => org.organisationId === organisationId) ,1)
            this.organisations = this.organisations.filter(org => org.organisationId === organisationId)
            return {successState : true, msg : "succesfuly deleted organisation"}
        }

        return {successState: false, msg : "member does not have permission to delete organisation"};
    }




}