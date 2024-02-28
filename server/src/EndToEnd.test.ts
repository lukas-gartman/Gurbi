import * as SuperTest from "supertest";
import {getApp} from "./app";
import { NewOrganisationDTO,  Organisation} from "./model/organisationModels";
import { DBconnHandler } from "./db/database";
import mongoose, { Connection } from "mongoose";

const uri : string = "mongodb://localhost:27017/dat076Test"

beforeAll(async () => {
    let conn : Connection = await DBconnHandler.newConn(uri);
    await conn.dropDatabase();
  });

test("/user/register", async () => {
  
  const request =  SuperTest.default(getApp(true));
  const res1 = await request.post("/user/register").send({fullName: "testUser1", nickname: "tu", email: "test@gmail.se", password: "123", repeatPassword: "123"});
  
});


test("/organisation/authorized/new", async () => {

  const request =  SuperTest.default(getApp(true));

  let org1 : NewOrganisationDTO = {roles : [], creatorNickName : "TestUserNickname", orgName : "TestOrg"};
  const res1 = await request.post("/organisation/authorized/new").set('authorization', "awdawdawd").send(org1);
  expect(res1.statusCode).toBe(200);


  let org2 : NewOrganisationDTO = {roles : [], creatorNickName : "TestUserNickname", orgName : "TestOrg"};
  const res2 = await request.post("/organisation/authorized/new").set('authorization', "awdawdawd").send(org1);
  expect(res2.statusCode).toBe(200);


  let org3 : NewOrganisationDTO = {roles : [], creatorNickName : "TestUserNickname", orgName : "TestOrg"};
  const res3 = await request.post("/organisation/authorized/new").set('authorization', "awdawdawd").send(org1);
  expect(res3.statusCode).toBe(200);


  let org4 : NewOrganisationDTO = {roles : [], creatorNickName : "TestUserNickname", orgName : "TestOrg"};
  const res4 = await request.post("/organisation/authorized/new").set('authorization', "awdawdawd").send(org1);
  expect(res4.statusCode).toBe(200);



  const res5 = await request.get("/organisation/by/id").send({organisationId: "2"});
  console.log(res5.body)

    
});


afterAll(async () => {
    DBconnHandler.closeConn();
    console.log('All tests have completed!');
  });
