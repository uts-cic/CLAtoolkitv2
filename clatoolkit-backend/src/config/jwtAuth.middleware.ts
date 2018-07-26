import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export let JwtAuthorized = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.header("Authorization");

	if (authHeader) {
		try {
			const decoded = jwt.verify(authHeader, JWT_SECRET);
			req.user = decoded;
			next();
		} catch (err) {
			return res.status(401).json({ error: "Not authorized" });
		}
	}

	return res.status(401).json({ error: "No token present" } );

};