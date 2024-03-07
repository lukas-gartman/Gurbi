import * as SuperTest from "supertest";
import {getApp} from "./app";
import { NewOrganisationDTO,  Organisation} from "./model/organisationModels";
import { Event, NewEventDTO} from "./model/eventModels";
import { DBconnHandler } from "./db/database";
import mongoose, { Connection } from "mongoose";
import { userServiceResponse } from "./model/UserModels";
import e from "express";

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

  const res2 = await request.post("/user/register").send({fullName: "testUser2", nickname: "tur", email: "test2@gmail.se", password: "1234", repeatPassword: "1234"});
  expect(res2.statusCode).toBe(200);
  expect(res2.text).toStrictEqual(userServiceResponse.getRes(4).msg);
  
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


test("post /organisation/authorized/user", async () =>{
  const res = await request.post("/user/login").send({email : "test2@gmail.se", password : "1234", rememberMe : true});
  let token : string = res.body.token

  const res2 = await request.post("/organisation/authorized/user").set('authorization', token).send({nickName : "nickname2", organisationId : "0"});
  
  expect(res2.statusCode).toBe(200);

});


test("post /organisation/:orgId/authorized/event", async () =>{
  const res = await request.post("/user/login").send({email : "test2@gmail.se", password : "1234", rememberMe : true});
  let token : string = res.body.token

  let event : NewEventDTO = {} as NewEventDTO;

  event.date = new Date();
  event.description = "my event description";
  event.location = "göteborg";
  event.title = "";

  const res2 = await request.post("/organisation/2/authorized/event").set('authorization', token).send(event);
  expect(res2.statusCode).toBe(401)

  const res3 = await request.post("/user/login").send({email : "test@gmail.se", password : "123", rememberMe : true});
  let token2 : string = res3.body.token


  const res4 = await request.post("/organisation/2/authorized/event").set('authorization', token2).send(event);
  expect(res4.statusCode).toBe(400)

  event.title = "Robot"
  const res5 = await request.post("/organisation/2/authorized/event").set('authorization', token2).send(event);
  expect(res5.statusCode).toBe(200)

  event.title = "computer"
  event.date = new Date();
  event.description = "my new description"
  event.location = "vänersborg"

  const res6 = await request.post("/organisation/2/authorized/event").set('authorization', token2).send(event);
  expect(res6.statusCode).toBe(200)


});

test("get /organisation/:orgId/events", async () => {

  let res = await request.get("/organisation/2/events");
  
  expect(res.statusCode).toBe(200);

  expect((res.body as Event[]).length).toBe(2);

});


afterAll(async () => {
    DBconnHandler.closeConn();
  });
