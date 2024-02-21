
import { Permission, ServerModifierResponse } from "../model/dataModels";
import { Member, NewOrganisationData, Organisation } from "../model/organisationModels";
import {OrganisationService} from "./organisationService";




test("test add organisation", async () => {
    const organisationService = new OrganisationService();

    let org1 : NewOrganisationData = {roles : [], creatorId : "TestUser", creatorNickName : "TestUserNickname", orgName : "TestOrg"}

    let answer : ServerModifierResponse = organisationService.addOrganisation(org1)

    expect(answer).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(200));


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

    let orgId : string | undefined = organisationService.getUserOrganisations("TestUser1")?.at(0)?.id;

    expect(organisationService.getMemberPermissions("TestUser1", orgId as string)?.length).toBe(organisationService.getAvilabePermissionns().length);


});

test("add member to organisation", async () => {
    const organisationService = new OrganisationService();

    let org1 : NewOrganisationData = {roles : [], creatorId : "TestUser1", creatorNickName : "TestUserNickname1", orgName : "TestOrg"};

    organisationService.addOrganisation(org1);
    

    let orgId : string | undefined= organisationService.getUserOrganisations("TestUser1").at(0)?.id;
    
    organisationService.addMemberToOrganisation("TestUser2", "TestUserNickname2", orgId  as string);


    //expect(organisationService.getOrganisationMembers(orgId as string).length).toBe(2);
    expect(organisationService.getOrganisation(orgId as string)?.members?.length).toBe(2)
    expect(organisationService.getOrganisation(orgId as string)?.members.find(member => member.userId === "TestUser2")?.roleName).toBe("member")
    expect(organisationService.addMemberToOrganisation("TestUser2", "TestUserNickname3", orgId  as string)).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(404))
    expect(organisationService.addMemberToOrganisation("TestUser3", "TestUserNickname2", orgId  as string)).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(405))
    expect(organisationService.addMemberToOrganisation("TestUser3", "TestUserNickname3", "wadawdawdfesgsegsegsegsegsdge12412412412412safasf")).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(401))

});


test("delete organisation", async () =>{
    
    const organisationService = new OrganisationService();
    let orgData : NewOrganisationData = {roles : [], creatorId : "TestUser1", creatorNickName : "TestUserNickname1", orgName : "TestOrg"};

    organisationService.addOrganisation(orgData);

    let orgId : string = organisationService.getUserOrganisations("TestUser1").at(0)?.id as string;

    organisationService.addMemberToOrganisation("TestUser2", "TestUserNickname2", orgId);


    expect(organisationService.deleteOrginsitaion("TestUser3", orgId)).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(402));
    expect(organisationService.deleteOrginsitaion("TestUser2", "aawdawdawdsegseg1231234")).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(401));
    expect(organisationService.deleteOrginsitaion("TestUser2", orgId)).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(403));
    expect(organisationService.getOrganisations().length).toBe(1);
    expect(organisationService.deleteOrginsitaion("TestUser1", orgId)).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(202));
    expect(organisationService.getOrganisations().length).toBe(0);

    
});

test("add role to organisation", async () => {
    const organisationService = new OrganisationService();
    let orgData : NewOrganisationData = {roles : [], creatorId : "TestUser1", creatorNickName : "TestUserNickname1", orgName : "TestOrg"};
    organisationService.addOrganisation(orgData);
    let orgId : string = organisationService.getUserOrganisations("TestUser1").at(0)?.id as string;
    organisationService.addMemberToOrganisation("TestUser2", "TestUserNickname2", orgId);

    expect(organisationService.addRoleToOrganisation("TestUser1", "awdawfawfsegty456346ewraqwdawd", {roleName : "myNewRole", permissions : [Permission.getPermission(0)]})).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(401))
    expect(organisationService.addRoleToOrganisation("TestUser3", orgId, {roleName : "myNewRole", permissions : [Permission.getPermission(0)]})).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(402));
    expect(organisationService.addRoleToOrganisation("TestUser2", orgId, {roleName : "myNewRole", permissions : [Permission.getPermission(0)]})).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(403));
    expect(organisationService.addRoleToOrganisation("TestUser1", orgId, {roleName : "myNewRole", permissions : [Permission.getPermission(0)]})).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(204));
    expect(organisationService.getOrganisation(orgId)?.roles.length).toBe(3);
});

test("delete role from organisation", async () => {
    const organisationService = new OrganisationService();
    let orgData : NewOrganisationData = {roles : [], creatorId : "TestUser1", creatorNickName : "TestUserNickname1", orgName : "TestOrg"};
    organisationService.addOrganisation(orgData);
    let orgId : string = organisationService.getUserOrganisations("TestUser1").at(0)?.id as string;
    organisationService.addMemberToOrganisation("TestUser2", "TestUserNickname2", orgId);


    expect(organisationService.addRoleToOrganisation("TestUser1", orgId, {roleName : "myNewRole", permissions : [Permission.getPermission(0)]})).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(204));
    expect(organisationService.deleteRoleFromOrganistation("TestUser2", orgId, "myNewRole")).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(403))
    expect(organisationService.getOrganisation(orgId)?.roles.length).toBe(3);

    expect(organisationService.deleteRoleFromOrganistation("TestUser1", orgId, "awfawfawd")).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(205))
    expect(organisationService.getOrganisation(orgId)?.roles.length).toBe(3);

    organisationService.addMemberToOrganisation("TestUser3", "TestUserNickname3", orgId);
    organisationService.changeRoleOfMember("TestUser1", orgId, "TestUser3", "myNewRole");

    expect(organisationService.deleteRoleFromOrganistation("TestUser1", orgId, "myNewRole")).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(205))
    expect(organisationService.getOrganisation(orgId)?.roles.length).toBe(2);
    expect(organisationService.getOrganisation(orgId)?.members?.find(member => member.userId === "TestUser3")?.roleName).toBe("member")
})

test("change member role", async () => {
    const organisationService = new OrganisationService();
    let orgData : NewOrganisationData = {roles : [], creatorId : "TestUser1", creatorNickName : "TestUserNickname1", orgName : "TestOrg"};
    organisationService.addOrganisation(orgData);
    let orgId : string = organisationService.getUserOrganisations("TestUser1").at(0)?.id as string;
    organisationService.addMemberToOrganisation("TestUser2", "TestUserNickname2", orgId);

    organisationService.addRoleToOrganisation("TestUser1", orgId, {roleName : "MyNewRole", permissions : [Permission.getPermission(0)]})

    expect(organisationService.changeRoleOfMember("TestUser1", orgId, "TestUser2", "MyNewawdawdRole")).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(408))
    expect(organisationService.changeRoleOfMember("TestUser1", orgId, "TestUser3", "MyNewRole")).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(409))
    expect(organisationService.changeRoleOfMember("TestUser1", orgId, "TestUser2", "MyNewRole")).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(206))
    expect(organisationService.getOrganisation(orgId)?.members.find(member => member.userId === "TestUser2")?.roleName).toBe("MyNewRole")

})