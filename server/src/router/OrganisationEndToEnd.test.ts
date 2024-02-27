import * as SuperTest from "supertest";
import {getApp} from "../app";
import { NewOrganisationDTO,  Organisation} from "../model/organisationModels";
import { conn } from "../db/database";
import mongoose from "mongoose";

const request = SuperTest.default(getApp(false));



test("/new", async () => {

    await conn.asPromise()
    let org1 : NewOrganisationDTO = {roles : [], creatorNickName : "TestUserNickname", orgName : "TestOrg"};
    const res1 = await request.post("/organisation/authorized/new").set('authorization', "awdawdawd").send(org1);
    expect(res1.statusCode).toBe(200);
   
    conn.close()

    
});
