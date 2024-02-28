import {Response, NextFunction} from "express";
import {AuthorizedRequest} from "./model/dataModels";
import * as jwt from 'jsonwebtoken';
import { MY_NOT_VERY_SECURE_PRIVATE_KEY } from ".";

export const authenticationMiddleware = async (req: AuthorizedRequest, res: Response, next: NextFunction) => {

  let token : string | string[] | undefined = req.headers.authorization

  if (typeof token !== 'string' || token === "") {
      return res.status(400).send("Not vaild authentication token")
    } else {
      let decoded : {userId : string} = jwt.verify(token, MY_NOT_VERY_SECURE_PRIVATE_KEY) as {userId : string};
      req['userId']= decoded.userId;
      next();
    }
};