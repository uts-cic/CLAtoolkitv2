import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export let JwtAuthorized = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.header("Authorization") || req.query.user;

	if (authHeader) {
		try {
			let isSocialSignUp: boolean = false;
			let token = undefined;

			// "Bearer 121in2nc1o23pfih13.d13d913hd13f1uasx9cudc8.21eu90d1x3xn31"
			if (authHeader.indexOf("Bearer") > -1) {
				token = authHeader.split(" ")[1];
			} else {
				token = authHeader;
				isSocialSignUp = !isSocialSignUp;
			}

			const decoded = jwt.verify(token, JWT_SECRET);
			req.user = decoded;

			if (isSocialSignUp) { 
				req.session.user = decoded; 
				req.session.clatkReturnTo = req.header("referer");
			}

			next();
		} catch (err) {
			return res.status(401).json({ error: "Not authorized: " + err });
		}
	} else {
		return res.status(401).json({ error: "No token present" } );
	}

	

};