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
  
  //register testUser1
  const res1 = await request.post("/user/register").send({fullName: "testUser1", nickname: "tu", email: "test@gmail.se", password: "123", repeatPassword: "123"});
  expect(res1.statusCode).toBe(200);
  expect(res1.text).toStrictEqual(userServiceResponse.getResponse(4).msg);

  //register testUser2
  const res2 = await request.post("/user/register").send({fullName: "testUser2", nickname: "tur", email: "test2@gmail.se", password: "1234", repeatPassword: "1234"});
  expect(res2.statusCode).toBe(200);
  expect(res2.text).toStrictEqual(userServiceResponse.getResponse(4).msg);
  
});


test("/user/login", async () => {
  //login testUser1
  const res1 = await request.post("/user/login").send({email : "test@gmail.se", password : "123", rememberMe : true});
  expect(res1.statusCode).toBe(200);
  expect(res1.body.succes).toBe(true);
  expect((res1.body.token  as string).length).toBeGreaterThan(0);
});

test("/organisation/authorized/new", async () => {
  
  //login testUser1
  const res = await request.post("/user/login").send({email : "test@gmail.se", password : "123", rememberMe : true});
  let token : string = res.body.token

  //testUser1 makes another org 
  let org1 : NewOrganisationDTO = {roles : [], creatorNickName : "TestUserNickname", orgName : "TestOrg1"};
  const res1 = await request.post("/organisation/authorized/new").set('authorization', token).send(org1);
  expect(res1.statusCode).toBe(200);

  //testUser1 makes another org 
  let org2 : NewOrganisationDTO = {roles : [], creatorNickName : "TestUserNickname", orgName : "TestOrg2"};
  const res2 = await request.post("/organisation/authorized/new").set('authorization', token).send(org1);
  expect(res2.statusCode).toBe(200);

  //testUser1 makes another org 
  let org3 : NewOrganisationDTO = {roles : [], creatorNickName : "TestUserNickname", orgName : "TestOrg3"};
  const res3 = await request.post("/organisation/authorized/new").set('authorization', token).send(org1);
  expect(res3.statusCode).toBe(200);

  //testUser1 makes another org 
  let org4 : NewOrganisationDTO = {roles : [], creatorNickName : "TestUserNickname", orgName : "TestOrg4"};
  const res4 = await request.post("/organisation/authorized/new").set('authorization', token).send(org1);
  expect(res4.statusCode).toBe(200);


  //login TestUser2
  const res5 = await request.post("/user/login").send({email : "test2@gmail.se", password : "1234", rememberMe : true});
  let token2 : string = res5.body.token

  //testUser2 makes an org
  let org5 : NewOrganisationDTO = {roles : [], creatorNickName : "TestUserNickname", orgName : "TestOrg5"};
  const res6 = await request.post("/organisation/authorized/new").set('authorization', token2).send(org5);
  expect(res6.statusCode).toBe(200);

    
});


test("/organisation/by/id", async () => {
  
  //get an organisation
  const res = await request.get("/organisation/by/id").send({organisationId: "2"});
  expect(res.body.id).toBe("2");
});


test("post /organisation/authorized/user", async () =>{
  
  //login testUser2
  const res = await request.post("/user/login").send({email : "test2@gmail.se", password : "1234", rememberMe : true});
  let token : string = res.body.token

  //add testUser2 as member of organisation id = 0 
  const res2 = await request.post("/organisation/authorized/user").set('authorization', token).send({nickName : "nickname2", organisationId : "0"});
  
  expect(res2.statusCode).toBe(200);

});


test("post /event/authorized/organisation/:orgId", async () =>{
  
  //login testUser2
  const res = await request.post("/user/login").send({email : "test2@gmail.se", password : "1234", rememberMe : true});
  let token : string = res.body.token

  //Create a new event
  let event : NewEventDTO = {} as NewEventDTO;
  event.date = new Date();
  event.description = "my event description";
  event.location = "göteborg";
  event.title = "";

  //let testUser2 that does not have prem for orgId = 2 try add an event
  const res2 = await request.post("/event/authorized/organisation/2").set('authorization', token).send(event);
  expect(res2.statusCode).toBe(401)


   //login testUser1
  const res3 = await request.post("/user/login").send({email : "test@gmail.se", password : "123", rememberMe : true});
  let token2 : string = res3.body.token


  //let testUser1 add an event with prem for orgId = 2 but not sending all data
  const res4 = await request.post("/event/authorized/organisation/2").set('authorization', token2).send(event);
  expect(res4.statusCode).toBe(400)

  //let testUser1 add an event with prem for orgId = 2 and full data
  event.title = "Robot"
  const res5 = await request.post("/event/authorized/organisation/2").set('authorization', token2).send(event);
  expect(res5.statusCode).toBe(200)

  event.title = "computer"
  event.date = new Date();
  event.description = "my new description"
  event.location = "vänersborg"

  //let testUser1 add an event with prem for orgId = 2 and full data
  const res6 = await request.post("/event/authorized/organisation/2").set('authorization', token2).send(event);
  expect(res6.statusCode).toBe(200)


  event.title = "router"
  event.date = new Date();
  event.description = "my new new description"
  event.location = "trollhättan"
  
  //let testUser1 add an event with prem for orgId = 4 and full data  
  const res7 = await request.post("/event/authorized/organisation/4").set('authorization', token).send(event);
  expect(res7.statusCode).toBe(200)



});


test("get /event/:eventId", async () => {

   //Retrive an event by id = 2
  let res = await request.get("/event/2");
  
  expect(res.statusCode).toBe(200);

  expect((res.body as Event).id).toBe("2");

});


test("get /event/organisation/:orgId/all", async () => {

  //Retrive all events hosted by orgId=2
  let res = await request.get("/event/organisation/2/all");
  
  expect(res.statusCode).toBe(200);

  expect((res.body as Event[]).length).toBe(2);

});


test("get /event/all", async () => {

  //Retrive all events
  let res = await request.get("/event/all");
  expect(res.statusCode).toBe(200);
  expect((res.body as Event[]).length).toBe(3);
  
})


afterAll(async () => {
    DBconnHandler.closeConn();
  });
