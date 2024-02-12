
import { NewOrganisation, Permission, Role, Organisation, Member } from "../model/organisationModels";



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

    addOrganisation(newOrgData : NewOrganisation){
        let roles : Role[] = newOrgData.roles;
        let creatorId : string = newOrgData.creatorId;
        let creatorNickName : string = newOrgData.creatorNickName;
        let organisationName : string = newOrgData.orgName;


        const permissionEntries: Permission[] = this.getAvilabePermissionns()
        
        //admin role added per default
        let admin : Role = {roleName : "admin", permission : permissionEntries};
        roles.push(admin);

        //creator added as admin per default
        let members : Member[] = [{memberId : creatorId, role : admin, nickName : creatorNickName}];


        this.organisations.push({members : members, roles : roles, organisationName : organisationName, id : "32e3d23dqwdw4et"});

    }




}