import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export let JwtAuthorized = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.header("Authorization");

	if (authHeader) {
		try {
			// "Bearer 121in2nc1o23pfih13.d13d913hd13f1uasx9cudc8.21eu90d1x3xn31"
			const token = authHeader.split(" ")[1];
			const decoded = jwt.verify(token, JWT_SECRET);
			req.user = decoded;
			next();
		} catch (err) {
			return res.status(401).json({ error: "Not authorized" });
		}
	} else {
		return res.status(401).json({ error: "No token present" } );
	}

	

};