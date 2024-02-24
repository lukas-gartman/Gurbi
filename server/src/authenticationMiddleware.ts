import express, {Response, NextFunction} from "express";
import {AuthorizedRequest} from "./model/dataModels";

export const authenticationMiddleware = (req: AuthorizedRequest, res: Response, next: NextFunction) => {

  let token : string | string[] | undefined = req.headers.authorization

  if (typeof token !== 'string' || token === "") {
      return res.status(400).send("Not vaild authentication token")
    } else {
      //add token decrypt stuff here
      req['userId']= "skofta";
      next();
    }
};