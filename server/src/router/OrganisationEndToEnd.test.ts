import * as SuperTest from "supertest";
import {app} from "../serverSetup";
import { NewOrganisationDTO } from "../model/organisationModels";

const request = SuperTest.default(app);

const route = "/authorized/organisation"

test(route + "/new", async () => {
    let org1 : NewOrganisationDTO = {roles : [], creatorNickName : "TestUserNickname", orgName : "TestOrg"};
    const res1 = await request.post(route+"/new").set('authorization', "wadawawefaw").send(org1);
    expect(res1.statusCode).toBe(200);
    
});