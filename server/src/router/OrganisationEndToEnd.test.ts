import * as SuperTest from "supertest";
import {app} from "../serverSetup";
import { NewOrganisationDTO,  Organisation} from "../model/organisationModels";

const request = SuperTest.default(app);


test("/new", async () => {
    let org1 : NewOrganisationDTO = {roles : [], creatorNickName : "TestUserNickname", orgName : "TestOrg"};
    const res1 = await request.post("/organisation/authorized/new").set('authorization', "wadawawefaw").send(org1);
    expect(res1.statusCode).toBe(200);
    
});

