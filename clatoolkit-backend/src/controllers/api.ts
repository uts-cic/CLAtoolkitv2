"use strict";

import * as async from "async";
import { NextFunction, Request, Response } from "express";
import * as graph from "fbgraph";
import * as request from "request";
import { default as User, UserModel } from "../models/User";


/**
 * GET /social/trello/boards
 * Returns a List of User Trello boards in the following format:
 *  [
 *    {key: BOARD_NAME, value: BOARD_ID},
 *     ...
 *     ...
 *  ]
 *                                                          TRELLO APP                               USER TOKEN 
 * https://api.trello.com/1/members/me/boards?key=c908d424dda56c79d373f780a1ae26c7&token=81c71f407c43875b393ccdc878a37a3acae853e267d98f0358bbf0d93e97b616
 */
export let getTrelloBoards = (req: Request, res: Response) => {
  const key = process.env.TRELLO_ID;
  const controller = this;
  

  User.findOne({ email: req.user.email }, (err, user: UserModel) => {
    const userToken = user.tokens.find(tok => tok.platform == "trello").accessToken;
    const trelloBoardApiEndpoint = `https://api.trello.com/1/members/me/boards?key=${key}&token=${userToken}`;

    request(trelloBoardApiEndpoint, (err, response, body) => {
      if (err || response.statusCode != 200) {
        console.log("Error grabbing trello boards, error: " + err + ". Status Code: " + response.statusCode);
      }

      const boardsResponse = [];
      for (const board of JSON.parse(body)) {
        boardsResponse.push({ key: board.id, value: board.name });
      }

      console.log("RETURNING: ", boardsResponse);
      return res.json({ boards: boardsResponse});
    });
  });

};

/**
 * GET /social/facebook
 * Facebook API example.
 */
export let getFacebook = (req: Request, res: Response, next: NextFunction) => {
  const token = req.user.tokens.find((token: any) => token.kind === "facebook");
  graph.setAccessToken(token.accessToken);
  graph.get(`${req.user.facebook}?fields=id,name,email,first_name,\
  last_name,gender,link,locale,timezone`, (err: Error, results: graph.FacebookUser) => {
    if (err) { return next(err); }
    res.render("api/facebook", {
      profile: results,
      title: "Facebook API",
    });
  });
};
