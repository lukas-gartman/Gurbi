import { userServiceResponse, UserLogin, IUser } from "../model/UserModels";
import { UserService } from "./userService";
import { MemoryUserStorage } from "../db/user.db";

test("Create new user", async () => {
    const userService = new UserService(new MemoryUserStorage());
    
    const newUser = {
        fullName: "Kalle Anka",
        nickname: "Kalle",
        email: "kalle@anka.se",
        password: "abc123",
        repeatPassword: "abc123",
    };
    
    let answer: userServiceResponses = await UserService.addUser(newUser);
    
    expect(answer).toStrictEqual(userServiceResponse.goRes(4));
})

test("Create new user without nickname", async () => {
    const userService = new UserService(new MemoryUserStorage());
    
    const newUser = {
        fullName: "Kalle Anka",
        email: "kalle@anka.se",
        password: "abc123",
        repeatPassword: "abc123",
    };
    
    let answer: userServiceResponses = await UserService.addUser(newUser);
    
    expect(answer).toStrictEqual(userServiceResponse.goRes(1));
})

test("Create new user with nonmatching password", async () => {
    const userService = new UserService(new MemoryUserStorage());
    
    const newUser = {
        fullName: "Kalle Anka",
        nickname: "Kalle",
        email: "kalle@anka.se",
        password: "abc123",
        repeatPassword: "123abc", /* Different order */
    };
    
    let answer: userServiceResponses = await UserService.addUser(newUser);
    
    expect(answer).toStrictEqual(userServiceResponse.goRes(2));
})

test("Create multiple users with same email", async () => {
    const userService = new UserService(new MemoryUserStorage());
    
    const newUserKalle = {
        fullName: "Kalle Anka",
        nickname: "Kalle",
        email: "kalle@anka.se",
        password: "abc123",
        repeatPassword: "abc123",
    };
    
    const newUserKajsa = {
        fullName: "Kajsa Anka",
        nickname: "Kaja",
        email: "kalle@anka.se",
        password: "abc123",
        repeatPassword: "abc123",
    };
    
    await UserService.addUser(newUserKalle);
    let answer: userServiceResponses = await UserService.addUser(newUserKajsa);
    
    expect(answer).toStrictEqual(userServiceResponse.goRes(3));
})