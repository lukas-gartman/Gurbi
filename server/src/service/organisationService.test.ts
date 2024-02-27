
import { conn } from "../db/database";
import { Permission, ServerModifierResponse } from "../model/dataModels";
import { Member, NewOrganisationData, Organisation} from "../model/organisationModels";
import {OrganisationService} from "./organisationService";




test("test add organisation", async () => {
    const organisationService = new OrganisationService(false);

    let org1 : NewOrganisationData = {roles : [], creatorId : "TestUser", creatorNickName : "TestUserNickname", orgName : "TestOrg"}

    let answer : ServerModifierResponse = await organisationService.addOrganisation(org1)

    expect(answer).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(200));


})

test("get organisations of user", async () => {
    const organisationService = new OrganisationService(false);

    let org1 : NewOrganisationData = {roles : [], creatorId : "TestUser1", creatorNickName : "TestUserNickname1", orgName : "TestOrg"};
    let org2 : NewOrganisationData = {roles : [], creatorId : "TestUser1", creatorNickName : "TestUserNickname2", orgName : "TestOrg2"};
    let org3 : NewOrganisationData = {roles : [], creatorId : "TestUser2", creatorNickName : "TestUserNickname3", orgName : "TestOrg3"};

    await organisationService.addOrganisation(org1);
    await organisationService.addOrganisation(org2);
    await organisationService.addOrganisation(org3);

    let userOrgs : Organisation[] | undefined = await organisationService.getUserOrganisations("TestUser1");

    expect(userOrgs?.length).toBe(2);


});


test("get all organisations", async () => {
    const organisationService = new OrganisationService(false);

    let org1 : NewOrganisationData = {roles : [], creatorId : "TestUser1", creatorNickName : "TestUserNickname1", orgName : "TestOrg"};
    let org2 : NewOrganisationData = {roles : [], creatorId : "TestUser1", creatorNickName : "TestUserNickname2", orgName : "TestOrg2"};
    let org3 : NewOrganisationData = {roles : [], creatorId : "TestUser2", creatorNickName : "TestUserNickname3", orgName : "TestOrg3"};

    await organisationService.addOrganisation(org1);
    await organisationService.addOrganisation(org2);
    await organisationService.addOrganisation(org3);

    let allOrgs : Organisation[] | undefined = await organisationService.getOrganisations();

    expect(allOrgs.length).toBe(3);


});

test("get user permissionns", async () => {
    const organisationService = new OrganisationService(false);

    let org1 : NewOrganisationData = {roles : [], creatorId : "TestUser1", creatorNickName : "TestUserNickname1", orgName : "TestOrg"};

    await organisationService.addOrganisation(org1);

    let orgId : string | undefined = (await organisationService.getUserOrganisations("TestUser1"))?.at(0)?.id;

    expect((await organisationService.getMemberPermissions("TestUser1", orgId as string))?.length).toBe(Permission.getAllPermissions().length);


});

test("add member to organisation", async () => {
    const organisationService = new OrganisationService(false);

    let org1 : NewOrganisationData = {roles : [], creatorId : "TestUser1", creatorNickName : "TestUserNickname1", orgName : "TestOrg"};

    await organisationService.addOrganisation(org1);
    

    let orgId : string | undefined= (await organisationService.getUserOrganisations("TestUser1")).at(0)?.id;
    
    await organisationService.addMemberToOrganisation("TestUser2", "TestUserNickname2", orgId  as string);


    //expect(organisationService.getOrganisationMembers(orgId as string).length).toBe(2);
    expect(( await organisationService.getOrganisation(orgId as string))?.members?.length).toBe(2)
    expect((await organisationService.getOrganisation(orgId as string))?.members.find(member => member.userId === "TestUser2")?.roleName).toBe("member")
    expect(await organisationService.addMemberToOrganisation("TestUser2", "TestUserNickname3", orgId  as string)).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(404))
    expect(await organisationService.addMemberToOrganisation("TestUser3", "TestUserNickname2", orgId  as string)).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(405))
    expect(await organisationService.addMemberToOrganisation("TestUser3", "TestUserNickname3", "wadawdawdfesgsegsegsegsegsdge12412412412412safasf")).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(401))

});


test("delete organisation", async () =>{
    
    const organisationService = new OrganisationService(false);
    let orgData : NewOrganisationData = {roles : [], creatorId : "TestUser1", creatorNickName : "TestUserNickname1", orgName : "TestOrg"};

    await organisationService.addOrganisation(orgData);

    let orgId : string = (await organisationService.getUserOrganisations("TestUser1")).at(0)?.id as string;

    await organisationService.addMemberToOrganisation("TestUser2", "TestUserNickname2", orgId);


    expect(await organisationService.deleteOrginsitaion("TestUser3", orgId)).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(402));
    expect(await organisationService.deleteOrginsitaion("TestUser2", "aawdawdawdsegseg1231234")).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(401));
    expect(await organisationService.deleteOrginsitaion("TestUser2", orgId)).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(403));
    expect((await organisationService.getOrganisations()).length).toBe(1);
    expect(await organisationService.deleteOrginsitaion("TestUser1", orgId)).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(202));
    expect((await organisationService.getOrganisations()).length).toBe(0);

    
});

test("add role to organisation", async () => {
    const organisationService = new OrganisationService(false);
    let orgData : NewOrganisationData = {roles : [], creatorId : "TestUser1", creatorNickName : "TestUserNickname1", orgName : "TestOrg"};
    await organisationService.addOrganisation(orgData);
    let orgId : string = (await organisationService.getUserOrganisations("TestUser1")).at(0)?.id as string;
    await organisationService.addMemberToOrganisation("TestUser2", "TestUserNickname2", orgId);

    expect(await organisationService.addRoleToOrganisation("TestUser1", "awdawfawfsegty456346ewraqwdawd", {roleName : "myNewRole", permissions : [Permission.getPermission(0)]})).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(401))
    expect(await organisationService.addRoleToOrganisation("TestUser3", orgId, {roleName : "myNewRole", permissions : [Permission.getPermission(0)]})).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(402));
    expect(await organisationService.addRoleToOrganisation("TestUser2", orgId, {roleName : "myNewRole", permissions : [Permission.getPermission(0)]})).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(403));
    expect(await organisationService.addRoleToOrganisation("TestUser1", orgId, {roleName : "myNewRole", permissions : [Permission.getPermission(0)]})).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(204));
    expect((await organisationService.getOrganisation(orgId))?.roles.length).toBe(3);
    expect(await organisationService.addRoleToOrganisation("TestUser1", orgId, {roleName : "myNewRole", permissions : [Permission.getPermission(0)]})).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(410));
});

test("delete role from organisation", async () => {
    const organisationService = new OrganisationService(false);
    let orgData : NewOrganisationData = {roles : [], creatorId : "TestUser1", creatorNickName : "TestUserNickname1", orgName : "TestOrg"};
    await organisationService.addOrganisation(orgData);
    let orgId : string = (await organisationService.getUserOrganisations("TestUser1")).at(0)?.id as string;
    await organisationService.addMemberToOrganisation("TestUser2", "TestUserNickname2", orgId);


    expect(await organisationService.addRoleToOrganisation("TestUser1", orgId, {roleName : "myNewRole", permissions : [Permission.getPermission(0)]})).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(204));
    expect(await organisationService.deleteRoleFromOrganistation("TestUser2", orgId, "myNewRole")).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(403))
    expect((await organisationService.getOrganisation(orgId))?.roles.length).toBe(3);

    expect(await organisationService.deleteRoleFromOrganistation("TestUser1", orgId, "awfawfawd")).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(205))
    expect((await organisationService.getOrganisation(orgId))?.roles.length).toBe(3);

    await organisationService.addMemberToOrganisation("TestUser3", "TestUserNickname3", orgId);
    await organisationService.changeRoleOfMember("TestUser1", orgId, "TestUser3", "myNewRole");

    expect(await organisationService.deleteRoleFromOrganistation("TestUser1", orgId, "myNewRole")).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(205))
    expect((await organisationService.getOrganisation(orgId))?.roles.length).toBe(2);
    expect((await organisationService.getOrganisation(orgId))?.members?.find(member => member.userId === "TestUser3")?.roleName).toBe("member")
})

test("change member role", async () => {
    const organisationService = new OrganisationService(false);
    let orgData : NewOrganisationData = {roles : [], creatorId : "TestUser1", creatorNickName : "TestUserNickname1", orgName : "TestOrg"};
    await organisationService.addOrganisation(orgData);
    let orgId : string = (await organisationService.getUserOrganisations("TestUser1")).at(0)?.id as string;
    await organisationService.addMemberToOrganisation("TestUser2", "TestUserNickname2", orgId);

    await organisationService.addRoleToOrganisation("TestUser1", orgId, {roleName : "MyNewRole", permissions : [Permission.getPermission(0)]})

    expect(await organisationService.changeRoleOfMember("TestUser1", orgId, "TestUser2", "MyNewawdawdRole")).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(408))
    expect(await organisationService.changeRoleOfMember("TestUser1", orgId, "TestUser3", "MyNewRole")).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(409))
    expect(await organisationService.changeRoleOfMember("TestUser1", orgId, "TestUser2", "MyNewRole")).toStrictEqual(ServerModifierResponse.GetServerModifierResponse(206))
    expect(( await organisationService.getOrganisation(orgId))?.members.find(member => member.userId === "TestUser2")?.roleName).toBe("MyNewRole")

})

conn.close();