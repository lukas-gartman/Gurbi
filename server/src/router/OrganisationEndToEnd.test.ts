import * as SuperTest from "supertest";
import {getApp} from "../app";
import { NewOrganisationDTO,  Organisation} from "../model/organisationModels";
import { DBconnHandler } from "../db/database";
import mongoose, { Connection } from "mongoose";

const uri : string = "mongodb://localhost:27017/dat076Test"

test("/endToEndTestOrganisation", async () => {


    let conn : Connection = await DBconnHandler.newConn(uri);
    conn.dropDatabase();

    const request =  SuperTest.default(getApp(true));

    let org1 : NewOrganisationDTO = {roles : [], creatorNickName : "TestUserNickname", orgName : "TestOrg"};
    const res1 = await request.post("/organisation/authorized/new").set('authorization', "awdawdawd").send(org1);
    expect(res1.statusCode).toBe(200);
   
    DBconnHandler.closeConn();

    
});
