
import { ServerModifierResponse } from "../model/dataModels";
import { Member, NewOrganisationData, Organisation } from "../model/organisationModels";
import {OrganisationService} from "./organisationService";





test("test add organisation", async () => {
    const organisationService = new OrganisationService();

    let org1 : NewOrganisationData = {roles : [], creatorId : "TestUser", creatorNickName : "TestUserNickname", orgName : "TestOrg"}

    let answer : ServerModifierResponse = organisationService.addOrganisation(org1)

    expect(answer).toStrictEqual({successState : true, msg : "organistation successfuly added"} as ServerModifierResponse);


})

test("get organisations of user", async () => {
    const organisationService = new OrganisationService();

    let org1 : NewOrganisationData = {roles : [], creatorId : "TestUser1", creatorNickName : "TestUserNickname1", orgName : "TestOrg"};
    let org2 : NewOrganisationData = {roles : [], creatorId : "TestUser1", creatorNickName : "TestUserNickname2", orgName : "TestOrg2"};
    let org3 : NewOrganisationData = {roles : [], creatorId : "TestUser2", creatorNickName : "TestUserNickname3", orgName : "TestOrg3"};

    organisationService.addOrganisation(org1);
    organisationService.addOrganisation(org2);
    organisationService.addOrganisation(org3);

    let userOrgs : Organisation[] | undefined = organisationService.getUserOrganisations("TestUser1");

    expect(userOrgs?.length).toBe(2);


});


test("get all organisations", async () => {
    const organisationService = new OrganisationService();

    let org1 : NewOrganisationData = {roles : [], creatorId : "TestUser1", creatorNickName : "TestUserNickname1", orgName : "TestOrg"};
    let org2 : NewOrganisationData = {roles : [], creatorId : "TestUser1", creatorNickName : "TestUserNickname2", orgName : "TestOrg2"};
    let org3 : NewOrganisationData = {roles : [], creatorId : "TestUser2", creatorNickName : "TestUserNickname3", orgName : "TestOrg3"};

    organisationService.addOrganisation(org1);
    organisationService.addOrganisation(org2);
    organisationService.addOrganisation(org3);

    let allOrgs : Organisation[] | undefined = organisationService.getOrganisations();

    expect(allOrgs.length).toBe(3);


});

test("get user permissionns", async () => {
    const organisationService = new OrganisationService();

    let org1 : NewOrganisationData = {roles : [], creatorId : "TestUser1", creatorNickName : "TestUserNickname1", orgName : "TestOrg"};

    organisationService.addOrganisation(org1);

    let orgId : string | undefined = organisationService.getUserOrganisations("TestUser1")?.at(0)?.organisationId;

    expect(organisationService.getMemberPermissions("TestUser1", orgId as string)?.permissions.length).toBe(organisationService.getAvilabePermissionns().length);


});

test("add member to organisation", async () => {
    const organisationService = new OrganisationService();

    let org1 : NewOrganisationData = {roles : [], creatorId : "TestUser1", creatorNickName : "TestUserNickname1", orgName : "TestOrg"};

    organisationService.addOrganisation(org1);
    

    let orgId : string | undefined= organisationService.getUserOrganisations("TestUser1").at(0)?.organisationId;
    
    organisationService.addMemberToOrganisation("TestUser2", "TestUserNickname2", orgId  as string);


    //expect(organisationService.getOrganisationMembers(orgId as string).length).toBe(2);
    expect(organisationService.getOrganisationMembers(orgId as string).length).toBe(2)
    expect(organisationService.getOrganisationMembers(orgId as string).find(member => member.userId === "TestUser2")?.role.roleName).toBe("member")
    expect(organisationService.addMemberToOrganisation("TestUser2", "TestUserNickname3", orgId  as string)).toStrictEqual({successState : false, msg : "user is already member in organisation"} as ServerModifierResponse)
    expect(organisationService.addMemberToOrganisation("TestUser3", "TestUserNickname2", orgId  as string)).toStrictEqual({successState : false, msg : "nickName is already used in organisation"} as ServerModifierResponse)
    expect(organisationService.addMemberToOrganisation("TestUser3", "TestUserNickname3", "wadawdawdfesgsegsegsegsegsdge12412412412412safasf")).toStrictEqual({successState : false, msg : "organisation does not exsit"} as ServerModifierResponse)

});


test("delete organisation", async () =>{
    
    const organisationService = new OrganisationService();
    let orgData : NewOrganisationData = {roles : [], creatorId : "TestUser1", creatorNickName : "TestUserNickname1", orgName : "TestOrg"};

    organisationService.addOrganisation(orgData);

    let orgId : string = organisationService.getUserOrganisations("TestUser1").at(0)?.organisationId as string;

    organisationService.addMemberToOrganisation("TestUser2", "TestUserNickname2", orgId);


    expect(organisationService.deleteOrginsitaion("TestUser3", orgId)).toStrictEqual({successState : false, msg : "not member in organisation"} as ServerModifierResponse);
    expect(organisationService.deleteOrginsitaion("TestUser2", "aawdawdawdsegseg1231234")).toStrictEqual({successState : false, msg : "organisation does not exsit"} as ServerModifierResponse);
    expect(organisationService.deleteOrginsitaion("TestUser2", orgId)).toStrictEqual({successState : false, msg : "member does not have permission to delete organisation"} as ServerModifierResponse);
    expect(organisationService.getOrganisations().length).toBe(1);
    expect(organisationService.deleteOrginsitaion("TestUser1", orgId)).toStrictEqual({successState : true, msg : "succesfuly deleted organisation"} as ServerModifierResponse);
    expect(organisationService.getOrganisations().length).toBe(0);

    
});

test("add role to organisation", async () => {
    const organisationService = new OrganisationService();
    let orgData : NewOrganisationData = {roles : [], creatorId : "TestUser1", creatorNickName : "TestUserNickname1", orgName : "TestOrg"};
    organisationService.addOrganisation(orgData);
    let orgId : string = organisationService.getUserOrganisations("TestUser1").at(0)?.organisationId as string;
    organisationService.addMemberToOrganisation("TestUser2", "TestUserNickname2", orgId);

    expect(organisationService.addRoleToOrganisation("TestUser1", "awdawfawfsegty456346ewraqwdawd", {roleName : "myNewRole", permissions : [{permissionName : "ChangeOrginsationName"}]})).toStrictEqual({successState : false, msg : "organisation does not exsit"} as ServerModifierResponse)
    expect(organisationService.addRoleToOrganisation("TestUser3", orgId, {roleName : "myNewRole", permissions : [{permissionName : "ChangeOrginsationName"}]})).toStrictEqual({successState : false, msg : "not member in organisation"} as ServerModifierResponse);
    expect(organisationService.addRoleToOrganisation("TestUser2", orgId, {roleName : "myNewRole", permissions : [{permissionName : "ChangeOrginsationName"}]})).toStrictEqual({successState : false, msg : "member does not have permission to add roles"} as ServerModifierResponse);
    expect(organisationService.addRoleToOrganisation("TestUser1", orgId, {roleName : "myNewRole", permissions : [{permissionName : "ChangeOrginsationName"}, {permissionName : "awdawfawfawetgwegfawefawdawd232323"}]})).toStrictEqual({successState : false, msg : "awdawfawfawetgwegfawefawdawd232323 is not an available premission"} as ServerModifierResponse);
    expect(organisationService.addRoleToOrganisation("TestUser1", orgId, {roleName : "myNewRole", permissions : [{permissionName : "ChangeOrginsationName"}]})).toStrictEqual({successState : true, msg : "role added to organisation"} as ServerModifierResponse);
    expect(organisationService.getOrganisation(orgId)?.organisationRoles.length).toBe(3);
});

test("delete role from organisation", async () => {
    const organisationService = new OrganisationService();
    let orgData : NewOrganisationData = {roles : [], creatorId : "TestUser1", creatorNickName : "TestUserNickname1", orgName : "TestOrg"};
    organisationService.addOrganisation(orgData);
    let orgId : string = organisationService.getUserOrganisations("TestUser1").at(0)?.organisationId as string;
    organisationService.addMemberToOrganisation("TestUser2", "TestUserNickname2", orgId);


    expect(organisationService.addRoleToOrganisation("TestUser1", orgId, {roleName : "myNewRole", permissions : [{permissionName : "ChangeOrginsationName"}]})).toStrictEqual({successState : true, msg : "role added to organisation"} as ServerModifierResponse);
    expect(organisationService.deleteRoleFromOrganistation("TestUser2", orgId, "myNewRole")).toStrictEqual({successState : false, msg : "member does not have permission to delete roles"})
    expect(organisationService.getOrganisation(orgId)?.organisationRoles.length).toBe(3);

    organisationService.getOrganisation(orgId)?.organisationMembers.push({userId : "TestUser3", nickName : "TestUserNickname3", role : {roleName : "myNewRole", permissions : [{permissionName : "ChangeOrginsationName"}]}})

    expect(organisationService.deleteRoleFromOrganistation("TestUser1", orgId, "awfawfawd")).toStrictEqual({successState : true, msg : "role has been deleted from organisation"})
    expect(organisationService.getOrganisation(orgId)?.organisationRoles.length).toBe(3);


    expect(organisationService.deleteRoleFromOrganistation("TestUser1", orgId, "myNewRole")).toStrictEqual({successState : true, msg : "role has been deleted from organisation"})
    expect(organisationService.getOrganisation(orgId)?.organisationRoles.length).toBe(2);
    expect(organisationService.getOrganisationMembers(orgId).find(member => member.userId === "TestUser3")?.role.roleName).toBe("member")
})
