
import { ServerModifierResponse } from "../model/dataModels";
import { Member, NewOrganisationData, Organisation } from "../model/organisationModels";
import {OrganisationService} from "./organisationService"


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

