import * as SuperTest from "supertest";
import {getApp} from "./app";
import { NewOrganisationDTO,  Organisation} from "./model/organisationModels";
import { DBconnHandler } from "./db/database";
import mongoose, { Connection } from "mongoose";
import { userServiceResponse } from "./model/UserModels";

const uri : string = "mongodb://localhost:27017/dat076Test"
let request : any;

beforeAll(async () => {
    let conn : Connection = await DBconnHandler.newConn(uri);
    await conn.dropDatabase();
    request =  SuperTest.default(getApp(true));
  });

test("/user/register", async () => {
  
  
  const res1 = await request.post("/user/register").send({fullName: "testUser1", nickname: "tu", email: "test@gmail.se", password: "123", repeatPassword: "123"});
  expect(res1.statusCode).toBe(200);
  expect(res1.text).toStrictEqual(userServiceResponse.getRes(4).msg);
  
});


test("/user/login", async () => {
  const res1 = await request.post("/user/login").send({email : "test@gmail.se", password : "123", rememberMe : true});
  expect(res1.statusCode).toBe(200);
  expect(res1.body.succes).toBe(true);
  expect((res1.body.token  as string).length).toBeGreaterThan(0);
});

test("/organisation/authorized/new", async () => {
  const res = await request.post("/user/login").send({email : "test@gmail.se", password : "123", rememberMe : true});
  let token : string = res.body.token


  let org1 : NewOrganisationDTO = {roles : [], creatorNickName : "TestUserNickname", orgName : "TestOrg1"};
  const res1 = await request.post("/organisation/authorized/new").set('authorization', token).send(org1);
  expect(res1.statusCode).toBe(200);


  let org2 : NewOrganisationDTO = {roles : [], creatorNickName : "TestUserNickname", orgName : "TestOrg2"};
  const res2 = await request.post("/organisation/authorized/new").set('authorization', token).send(org1);
  expect(res2.statusCode).toBe(200);


  let org3 : NewOrganisationDTO = {roles : [], creatorNickName : "TestUserNickname", orgName : "TestOrg3"};
  const res3 = await request.post("/organisation/authorized/new").set('authorization', token).send(org1);
  expect(res3.statusCode).toBe(200);


  let org4 : NewOrganisationDTO = {roles : [], creatorNickName : "TestUserNickname", orgName : "TestOrg4"};
  const res4 = await request.post("/organisation/authorized/new").set('authorization', token).send(org1);
  expect(res4.statusCode).toBe(200);

    
});

test("/organisation/by/id", async () => {
  const res = await request.get("/organisation/by/id").send({organisationId: "2"});
  expect(res.body.id).toBe("2");
});



afterAll(async () => {
    DBconnHandler.closeConn();
  });
