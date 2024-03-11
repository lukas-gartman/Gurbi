import {Response, NextFunction} from "express";
import {AuthorizedRequest} from "./model/dataModels";
import * as jwt from 'jsonwebtoken';
import { MY_NOT_VERY_SECURE_PRIVATE_KEY } from "./app";

export const authenticationMiddleware = async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
	let token : string | string[] | undefined = req.headers.authorization
	if (typeof token !== 'string') {
		return res.status(400).send("Not a valid authentication token (string error)")
	}

	token = token.replace("Bearer ", ''); // Apparently jsonwebtoken is unable to handle this...

	try {
		let decoded = jwt.verify(token, MY_NOT_VERY_SECURE_PRIVATE_KEY) as {userId : number};
		req['userId']= decoded.userId;
		next();
	} catch (e: any) {
		return res.status(401).send(e);
	}
};