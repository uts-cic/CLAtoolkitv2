"use strict";

import * as async from "async";
import { NextFunction, Request, Response } from "express";
import * as graph from "fbgraph";
import * as request from "request";
import { default as User, UserModel } from "../models/User";


/**
 * GET /:platform/opts
 *
 * Retrieves platform options for a specific platform, e.g.:
 *  - :platform == 'trello': retrieves and returns trello boards for the user
 */
export let getPlatformOpts = (req: Request, res: Response) => {
  const optsMap: any = {
    "trello": getTrelloBoards,
    "slack": getSlackChannels
  };

  optsMap[req.params.platform](req, res);
};

/**
 * GET /social/slack/channels
 * Returns a list of user slack channels for team added via clatoolkit:
 * [
 *   { key: channel_name, value: channel_id},
 *   ...
 *   ...
 * ]
 *
 * https://slack.com/api/channels.list?token=xoxp-76496995568-285467434001-318915100980-f72ba65ca935b5b50e59857ed0c4c3d6
 */
export let getSlackChannels = (req: Request, res: Response) => {
  User.findOne({ email: req.user.email }, (err, user: UserModel) => {
    const userToken = user.tokens.find(tok => tok.platform == "slack").accessToken;
    const slackChannelsApiEndpoint = `https://slack.com/api/channels.list?token=${userToken}`;

    request(slackChannelsApiEndpoint, (err, response, body) => {
                    // Slack Specific
      if (err || JSON.parse(body).ok == false  || response.statusCode != 200) {
        console.error("Error grabbing slack channels. error: " + err + ". Status code: " + response.statusCode);
      }

      const channelsResponse = [];
      const channelsArr = JSON.parse(body).channels;

      for (const channel of channelsArr) {
        channelsResponse.push({ key: channel.id, value: channel.name_normalized });
      }
      // console.log("SLACK CHANNELS. RETURNING: ", channelsResponse);

      return res.json({ opts: channelsResponse });
    });
  });
};

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
  const key = process.env.TRELLO_APP_ID;  

  User.findOne({ email: req.user.email }, (err, user: UserModel) => {
    const userToken = user.tokens.find(tok => tok.platform == "trello").accessToken;
    const trelloBoardApiEndpoint = `https://api.trello.com/1/members/me/boards?key=${key}&token=${userToken}`;

    request(trelloBoardApiEndpoint, (err, response, body) => {
      if (err || response.statusCode != 200) {
        console.error("Error grabbing trello boards, error: " + err + ". Status Code: " + response.statusCode);
      }

      const boardsResponse = [];
      for (const board of JSON.parse(body)) {
        boardsResponse.push({ key: board.id, value: board.name });
      }

      // console.log("RETURNING: ", boardsResponse);
      return res.json({ opts: boardsResponse});
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
