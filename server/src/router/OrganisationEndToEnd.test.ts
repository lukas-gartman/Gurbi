import * as SuperTest from "supertest";
import {getApp} from "../app";
import { NewOrganisationDTO,  Organisation} from "../model/organisationModels";

const request = SuperTest.default(getApp(false));


test("/new", async () => {
    let org1 : NewOrganisationDTO = {roles : [], creatorNickName : "TestUserNickname", orgName : "TestOrg"};
    const res1 = await request.post("/organisation/authorized/new").set('authorization', "awdawdawd").send(org1);
    expect(res1.statusCode).toBe(200);
    
});

