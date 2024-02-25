import * as SuperTest from "supertest";
import {getApp} from "../app";
import {NewOrganisationDTO} from "../model/organisationModels";
import { Application } from "express";

const app : Application = getApp(false);

const request = SuperTest.default(app);


test("/new", async () => {
    let org1 : NewOrganisationDTO = {roles : [], creatorNickName : "TestUserNickname", orgName : "TestOrg"};
    const res1 = await request.post("/organisation/authorized/new").set('authorization', "wadawawefaw").send(org1);
    expect(res1.statusCode).toBe(200);
    
});

