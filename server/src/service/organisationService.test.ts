

import { EventStorage } from "../db/event.db";
import { MemoryOrganisationStorage } from "../db/organisation.db";
import { Permission, ServiceResponse, getAllPermissions} from "../model/dataModels";
import { OrgServiceResponse } from "../model/organisationModels";
import { NewOrganisationData, Organisation} from "../model/organisationModels";
import {OrganisationService} from "./organisationService";

test("test add organisation", async () => {
    const organisationService = new OrganisationService(new MemoryOrganisationStorage());
    
    let org1 : NewOrganisationData = {roles : [], creatorId : 1, creatorNickName : "TestUserNickname", orgName : "TestOrg"}
    let answer : ServiceResponse = await organisationService.addOrganisation(org1)

    expect(answer).toStrictEqual(OrgServiceResponse.getRes(200));
})

test("get organisations of user", async () => {
    const organisationService = new OrganisationService(new MemoryOrganisationStorage());

    let org1 : NewOrganisationData = {roles : [], creatorId : 1, creatorNickName : "TestUserNickname1", orgName : "TestOrg"};
    let org2 : NewOrganisationData = {roles : [], creatorId : 1, creatorNickName : "TestUserNickname2", orgName : "TestOrg2"};
    let org3 : NewOrganisationData = {roles : [], creatorId : 2, creatorNickName : "TestUserNickname3", orgName : "TestOrg3"};

    await organisationService.addOrganisation(org1);
    await organisationService.addOrganisation(org2);
    await organisationService.addOrganisation(org3);

    let userOrgs : Organisation[] | undefined = await organisationService.getUserOrganisations(1);

    expect(userOrgs?.length).toBe(2);
});


test("get all organisations", async () => {
    const organisationService = new OrganisationService(new MemoryOrganisationStorage());

    let org1 : NewOrganisationData = {roles : [], creatorId : 1, creatorNickName : "TestUserNickname1", orgName : "TestOrg"};
    let org2 : NewOrganisationData = {roles : [], creatorId : 1, creatorNickName : "TestUserNickname2", orgName : "TestOrg2"};
    let org3 : NewOrganisationData = {roles : [], creatorId : 2, creatorNickName : "TestUserNickname3", orgName : "TestOrg3"};

    await organisationService.addOrganisation(org1);
    await organisationService.addOrganisation(org2);
    await organisationService.addOrganisation(org3);

    let allOrgs : Organisation[] | undefined = await organisationService.getOrganisations();

    expect(allOrgs.length).toBe(3);
});

test("get user permissionns", async () => {
    const organisationService = new OrganisationService(new MemoryOrganisationStorage());

    let org1 : NewOrganisationData = {roles : [], creatorId : 1, creatorNickName : "TestUserNickname1", orgName : "TestOrg"};
    await organisationService.addOrganisation(org1);

    let orgId : number | undefined = (await organisationService.getUserOrganisations(1))?.at(0)?.id;

    expect((await organisationService.getMemberPermissions({userId: 1, organisationId : orgId as number}))?.length).toBe(getAllPermissions().length);
});

test("add member to organisation", async () => {
    const organisationService = new OrganisationService(new MemoryOrganisationStorage());

    let org1 : NewOrganisationData = {roles : [], creatorId : 1, creatorNickName : "TestUserNickname1", orgName : "TestOrg"};
    await organisationService.addOrganisation(org1);

    let orgId : number | undefined= (await organisationService.getUserOrganisations(1)).at(0)?.id;
    await organisationService.addMemberToOrganisation(2, "TestUserNickname2", orgId as number);

    //expect(organisationService.getOrganisationMembers(orgId as string).length).toBe(2);
    expect(( await organisationService.getOrganisation(orgId as number))?.members?.length).toBe(2)
    expect((await organisationService.getOrganisation(orgId as number))?.members.find(member => member.userId === 2)?.roleName).toBe("member")
    expect(await organisationService.addMemberToOrganisation(2, "TestUserNickname3", orgId  as number)).toStrictEqual(OrgServiceResponse.getRes(404))
    expect(await organisationService.addMemberToOrganisation(3, "TestUserNickname2", orgId  as number)).toStrictEqual(OrgServiceResponse.getRes(405))
    expect(await organisationService.addMemberToOrganisation(3, "TestUserNickname3", 1337)).toStrictEqual(OrgServiceResponse.getRes(401))
});


test("delete organisation", async () =>{
    const organisationService = new OrganisationService(new MemoryOrganisationStorage());

    let orgData : NewOrganisationData = {roles : [], creatorId : 1, creatorNickName : "TestUserNickname1", orgName : "TestOrg"};
    await organisationService.addOrganisation(orgData);

    let orgId = (await organisationService.getUserOrganisations(1)).at(0)?.id as number;
    await organisationService.addMemberToOrganisation(2, "TestUserNickname2", orgId);

    expect(await organisationService.deleteOrganisation(3, orgId)).toStrictEqual(OrgServiceResponse.getRes(402));
    expect(await organisationService.deleteOrganisation(2, 7331)).toStrictEqual(OrgServiceResponse.getRes(401));
    expect(await organisationService.deleteOrganisation(2, orgId)).toStrictEqual(OrgServiceResponse.getRes(403));
    expect((await organisationService.getOrganisations()).length).toBe(1);
    expect(await organisationService.deleteOrganisation(1, orgId)).toStrictEqual(OrgServiceResponse.getRes(202));
    expect((await organisationService.getOrganisations()).length).toBe(0);
});

test("add role to organisation", async () => {
    const organisationService = new OrganisationService(new MemoryOrganisationStorage());
    let orgData : NewOrganisationData = {roles : [], creatorId : 1, creatorNickName : "TestUserNickname1", orgName : "TestOrg"};
    await organisationService.addOrganisation(orgData);
    let orgId = (await organisationService.getUserOrganisations(1)).at(0)?.id as number;
    await organisationService.addMemberToOrganisation(2, "TestUserNickname2", orgId);

    expect(await organisationService.addRoleToOrganisation(1, 1234, {roleName : "myNewRole", permissions : [Permission.ChangeOrganisationName]})).toStrictEqual(OrgServiceResponse.getRes(401))
    expect(await organisationService.addRoleToOrganisation(3, orgId, {roleName : "myNewRole", permissions : [Permission.ChangeOrganisationName]})).toStrictEqual(OrgServiceResponse.getRes(402));
    expect(await organisationService.addRoleToOrganisation(2, orgId, {roleName : "myNewRole", permissions : [Permission.ChangeOrganisationName]})).toStrictEqual(OrgServiceResponse.getRes(403));
    expect(await organisationService.addRoleToOrganisation(1, orgId, {roleName : "myNewRole", permissions : [Permission.ChangeOrganisationName]})).toStrictEqual(OrgServiceResponse.getRes(204));
    expect((await organisationService.getOrganisation(orgId))?.roles.length).toBe(3);
    expect(await organisationService.addRoleToOrganisation(1, orgId, {roleName : "myNewRole", permissions : [Permission.ChangeOrganisationName]})).toStrictEqual(OrgServiceResponse.getRes(410));
});

test("delete role from organisation", async () => {
    const organisationService = new OrganisationService(new MemoryOrganisationStorage());
    let orgData : NewOrganisationData = {roles : [], creatorId : 1, creatorNickName : "TestUserNickname1", orgName : "TestOrg"};
    await organisationService.addOrganisation(orgData);
    let orgId = (await organisationService.getUserOrganisations(1)).at(0)?.id as number;
    await organisationService.addMemberToOrganisation(2, "TestUserNickname2", orgId);


    expect(await organisationService.addRoleToOrganisation(1, orgId, {roleName : "myNewRole", permissions : [Permission.ChangeOrganisationName]})).toStrictEqual(OrgServiceResponse.getRes(204));
    expect(await organisationService.deleteRoleFromOrganistation(2, orgId, "myNewRole")).toStrictEqual(OrgServiceResponse.getRes(403))
    expect((await organisationService.getOrganisation(orgId))?.roles.length).toBe(3);

    expect(await organisationService.deleteRoleFromOrganistation(1, orgId, "awfawfawd")).toStrictEqual(OrgServiceResponse.getRes(205))
    expect((await organisationService.getOrganisation(orgId))?.roles.length).toBe(3);

    await organisationService.addMemberToOrganisation(3, "TestUserNickname3", orgId);
    await organisationService.changeRoleOfMember(1, orgId, 3, "myNewRole");

    expect(await organisationService.deleteRoleFromOrganistation(1, orgId, "myNewRole")).toStrictEqual(OrgServiceResponse.getRes(205))
    expect((await organisationService.getOrganisation(orgId))?.roles.length).toBe(2);
    expect((await organisationService.getOrganisation(orgId))?.members?.find(member => member.userId === 3)?.roleName).toBe("member")
})

test("change member role", async () => {
    const organisationService = new OrganisationService(new MemoryOrganisationStorage());
    
    let orgData : NewOrganisationData = {roles : [], creatorId : 1, creatorNickName : "TestUserNickname1", orgName : "TestOrg"};
    await organisationService.addOrganisation(orgData);
    
    let orgId = (await organisationService.getUserOrganisations(1)).at(0)?.id as number;
    await organisationService.addMemberToOrganisation(2, "TestUserNickname2", orgId);
    await organisationService.addRoleToOrganisation(1, orgId, {roleName : "MyNewRole", permissions : [Permission.ChangeOrganisationName]})

    expect(await organisationService.changeRoleOfMember(1, orgId, 2, "MyNewawdawdRole")).toStrictEqual(OrgServiceResponse.getRes(408))
    expect(await organisationService.changeRoleOfMember(1, orgId, 3, "MyNewRole")).toStrictEqual(OrgServiceResponse.getRes(409))
    expect(await organisationService.changeRoleOfMember(1, orgId, 2, "MyNewRole")).toStrictEqual(OrgServiceResponse.getRes(206))
    expect(( await organisationService.getOrganisation(orgId))?.members.find(member => member.userId === 2)?.roleName).toBe("MyNewRole")
})
