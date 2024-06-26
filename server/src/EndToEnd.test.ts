import * as SuperTest from "supertest";
import {getApp} from "./app";
import { NewOrganisationDTO,  Organisation} from "./model/organisationModels";
import { Event, NewEventDTO} from "./model/eventModels";
import { DBconnHandler } from "./db/database";
import { Connection } from "mongoose";
import { userServiceResponse } from "./model/UserModels";

const uri : string = "mongodb://localhost:27017/dat076Test"
let request : any;

beforeAll(async () => {
	let conn : Connection = await DBconnHandler.newConn(uri);
	await conn.dropDatabase();
	request = SuperTest.default(getApp(true));
});

test("/user/register", async () => {
  //register testUser1
  let res1 = await request.post("/user/register").send({fullName: "testUser1", nickname: "a", email: "test@gmail.se", password: "123", repeatPassword: "123"});
  expect(res1.statusCode).toBe(200);
  expect(res1.text).toStrictEqual(userServiceResponse.getResponse(4).msg);

  //register testUser2
  let res2 = await request.post("/user/register").send({fullName: "testUser2", nickname: "b", email: "test2@gmail.se", password: "123", repeatPassword: "123"});
  expect(res2.statusCode).toBe(200);
  expect(res2.text).toStrictEqual(userServiceResponse.getResponse(4).msg);

  //register testUser3
  let res3 = await request.post("/user/register").send({fullName: "testUser3", nickname: "c", email: "test3@gmail.se", password: "123", repeatPassword: "123"});
  expect(res3.statusCode).toBe(200);
  expect(res3.text).toStrictEqual(userServiceResponse.getResponse(4).msg);

  //register testUser4
  let res4 = await request.post("/user/register").send({fullName: "testUser4", nickname: "d", email: "test4@gmail.se", password: "123", repeatPassword: "123"});
  expect(res4.statusCode).toBe(200);
  expect(res4.text).toStrictEqual(userServiceResponse.getResponse(4).msg);
});

test("/user/login", async () => {
  //login testUser1
  let res1 = await request.post("/user/login").send({email : "test@gmail.se", password : "123", rememberMe : true});
  expect(res1.statusCode).toBe(200);
  expect(res1.body.succes).toBe(true);
  expect((res1.body.token as string).length).toBeGreaterThan(0);
});

test("/organisation/authorized/new", async () => {
  //login testUser1
  let res = await request.post("/user/login").send({email : "test@gmail.se", password : "123", rememberMe : true});
  let token : string = res.body.token

  //testUser1 makes another org 
  let org1 : NewOrganisationDTO = {roles : [], creatorNickName : "TestUserNickname", name : "TestOrg1", description : "my desc"};
  let res1 = await request.post("/organisation/authorized/new").set('Authorization', token).send(org1);
  expect(res1.statusCode).toBe(200);

  //testUser1 makes another org 
  let org2 : NewOrganisationDTO = {roles : [], creatorNickName : "TestUserNickname", name : "TestOrg2", description : "my desc"};
  let res2 = await request.post("/organisation/authorized/new").set('Authorization', token).send(org2);
  expect(res2.statusCode).toBe(200);

  //testUser1 makes another org 
  let org3 : NewOrganisationDTO = {roles : [], creatorNickName : "TestUserNickname", name : "TestOrg3", description : "my desc"};
  let res3 = await request.post("/organisation/authorized/new").set('Authorization', token).send(org3);
  expect(res3.statusCode).toBe(200);

  //testUser1 makes another org 
  let org4 : NewOrganisationDTO = {roles : [], creatorNickName : "", name : "TestOrg4", description : "my desc"};
  let res4 = await request.post("/organisation/authorized/new").set('Authorization', token).send(org4);
  expect(res4.statusCode).toBe(200);

  //login TestUser2
  let res5 = await request.post("/user/login").send({email : "test2@gmail.se", password : "123", rememberMe : true});
  let token2 : string = res5.body.token

  //testUser2 makes an org
  let org5 : NewOrganisationDTO = {roles : [], creatorNickName : "TestUserNickname", name : "TestOrg5", description : "my desc"};
  let res6 = await request.post("/organisation/authorized/new").set('Authorization', token2).send(org5);
  expect(res6.statusCode).toBe(200);
});

test("/organisation/:orgId", async () => {
	//get an organisation
	const res = await request.get("/organisation/2").send();
	expect(res.body.id).toBe(2);
});

test("get /organisation/all", async () => {
	//get an organisation
	const res = await request.get("/organisation/all").send();
	expect(res.body.length).toBe(5);
});

test("post /organisation/authorized/user", async () =>{
  //login testUser2
  let res = await request.post("/user/login").send({email : "test2@gmail.se", password : "123", rememberMe : true});
  let token : string = res.body.token

  //add testUser2 as member of organisation id = 0 
  let res2 = await request.post("/organisation/authorized/user").set('Authorization', token).send({nickName : "nickname2", organisationId : 0});
  expect(res2.statusCode).toBe(200);


  //login testUser3
  let res1 = await request.post("/user/login").send({email : "test3@gmail.se", password : "123", rememberMe : true});
  let token2 : string = res1.body.token
  

  //add testUser3 as member of organisation id = 0 
  let res3 = await request.post("/organisation/authorized/user").set('Authorization', token2).send({nickName : "nickname3", organisationId : 0});
  expect(res3.statusCode).toBe(200);

  let res4 = await request.get("/organisation/0").send();
  expect(res4.body.members.length).toBe(3);

});


test("delete /organisation/:orgId/authorized/user", async () => {
  //login testUser3
  let res = await request.post("/user/login").send({email : "test3@gmail.se", password : "123", rememberMe : true});
  let token : string = res.body.token;

  //remove testUser3 as member of orgId = 0
  let res2 = await request.delete("/organisation/0/authorized/user").set('Authorization', token);
  expect(res2.statusCode).toBe(200);

  let res3 = await request.get("/organisation/0").send();
  expect(res3.body.members.length).toBe(2);

  //login testUser1
  let res4 = await request.post("/user/login").send({email : "test@gmail.se", password : "123", rememberMe : true});
  let token2 : string = res4.body.token;
  
  //try to remove testUser1 as member of orgId = 0, but is the only admin left
  let res5 = await request.delete("/organisation/0/authorized/user").set('Authorization', token2).send();
  expect(res5.statusCode).toBe(403);


})

test("post /organisation/authorized/user/role", async () => {

  //login testUser1
  let res1 = await request.post("/user/login").send({email : "test@gmail.se", password : "123", rememberMe : true});
  let token : string = res1.body.token;
  
  //try to change the role of testUser1 as member of orgId = 0, but is the only admin left
  let res2 = await request.put("/organisation/authorized/user/role").set('Authorization', token).send({organisationId : 0, targetMemberId : 0, roleName : "member"});
  expect(res2.statusCode).toBe(403);


})

test("post /event/authorized/organisation/:orgId", async () => {
  //login testUser2
  let res = await request.post("/user/login").send({email : "test2@gmail.se", password : "123", rememberMe : true});
  let token : string = res.body.token

  //Create a new event
  let event : NewEventDTO = {} as NewEventDTO;
  event.date = new Date();
  event.description = "my event description";
  event.location = "göteborg";
  event.title = "";
  event.picture = "";

  //let testUser2 that does not have prem for orgId = 2 try add an event
  let res2 = await request.post("/event/authorized/organisation/2").set('Authorization', token).send(event);
  expect(res2.statusCode).toBe(401)


   //login testUser1
  let res3 = await request.post("/user/login").send({email : "test@gmail.se", password : "123", rememberMe : true});
  let token2 : string = res3.body.token


  //let testUser1 add an event with prem for orgId = 2 but not sending all data
  let res4 = await request.post("/event/authorized/organisation/2").set('Authorization', token2).send(event);
  expect(res4.statusCode).toBe(400)

  //let testUser1 add an event with prem for orgId = 2 and full data
  event.title = "Robot"
  let res5 = await request.post("/event/authorized/organisation/2").set('Authorization', token2).send(event);
  expect(res5.statusCode).toBe(200)

  event.title = "computer"
  event.date = new Date();
  event.description = "my new description"
  event.location = "vänersborg"

  //let testUser1 add an event with prem for orgId = 2 and full data
  let res6 = await request.post("/event/authorized/organisation/2").set('Authorization', token2).send(event);
  expect(res6.statusCode).toBe(200)


  event.title = "router"
  event.date = new Date();
  event.description = "my new new description"
  event.location = "trollhättan"
  
  //let testUser1 add an event with prem for orgId = 4 and full data  
  let res7 = await request.post("/event/authorized/organisation/4").set('Authorization', token).send(event);
  expect(res7.statusCode).toBe(200)
});

test("get /event/:eventId", async () => {
	let res = await request.get("/event/2");
	
	expect(res.statusCode).toBe(200);
	expect((res.body as Event).id).toBe(2);
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
});

afterAll(async () => {
	DBconnHandler.closeConn();
});
