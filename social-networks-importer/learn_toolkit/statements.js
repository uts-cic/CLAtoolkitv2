// Create Statements
const lrs = require('./lrs_objects');


function twitter(posts, useremail) {
    let statements = [];
    posts.forEach( (post) => {

        let stmt = lrs.statement();
        stmt.actor.objectType = "Agent";
        stmt.actor.account.name = useremail;
        stmt.actor.account.homePage = "http://www.twitter.com/" + post.user.screen_name;
        stmt.verb.id = "http://activitystrea.ms/create";
        stmt.verb.display["en-US"] = "created";
        stmt.object.id="http://twitter.com/statuses/" + post.id;
        stmt.object.objectType ="Activity";
        stmt.object.definition.name["en-US"] = "Tweet";
        stmt.object.definition.description["en-US"] = post.full_text;
        stmt.context.platform = "Twitter";
        post.entities.hashtags.forEach( (hashtag) => {
            var tempObject = lrs.object();
            tempObject.definition.name["en-US"] = hashtag.text
            tempObject.objectType = "Activity"
            tempObject.definition.type = "http://activitystrea.ms/tag"
            stmt.context.contextActivities.other.push(tempObject)
        })
        post.entities.user_mentions.forEach( (user) => {
            var tempObject = lrs.object();
            tempObject.definition.name["en-US"] = user.screen_name
            tempObject.objectType = "Activity"
            tempObject.definition.type = "http://activitystrea.ms/tag"
            stmt.context.contextActivities.other.push(tempObject)
        })
        statements.push(stmt);
            

    });

    return statements;
}

function trelloStmtMap(stmt, post) {
    stmt.object.objectType = "Activity";
    stmt.context.platform = "Trello";
    switch (post.type) {
        case "commentCard":
            stmt.verb.id = "http://adlnet.gov/expapi/verbs/commented";
            stmt.verb.display["en-US"] = "commented";
            stmt.object.definition.name["en-US"] = post.data.card.name;
            stmt.object.id = "https://trello.com/c/" + post.data.card.shortLink;
            stmt.object.definition.description["en-US"] = "Trello Card";
            stmt.result = {};
            stmt.result.response = post.data.text;

            var tempObject = lrs.object();
            tempObject.definition.name["en-US"] = post.data.board.name;
            tempObject.objectType = "Activity"
            tempObject.id = "https://trello.com/b/" + post.data.board.shortLink;
            stmt.context.contextActivities.other.push(tempObject);

            tempObject = lrs.object();
            tempObject.definition.name["en-US"] = post.data.list.name;
            tempObject.objectType = "Activity"
            tempObject.definition.type = "http://id.tincanapi.com/activitytype/category";
            stmt.context.contextActivities.other.push(tempObject);

        break;
        case "updateCard": 
            stmt.verb.id = "http://activitystrea.ms/update";
            stmt.verb.display["en-US"] = "updated";
            stmt.object.id = "https://trello.com/c/" + post.data.card.shortLink;
            stmt.object.definition.name["en-US"] = post.data.card.name;
            stmt.object.definition.description["en-US"] = "Trello Card";
            stmt.result = {};

            // this needs high-level thinking.. Will come back to later

            for (key of Object.keys(post.data.old)) {
                stmt.result.response = post.data.card[key];
            }

            // Put in old somewhere?
            var tempObject = lrs.object();
            tempObject.definition.name["en-US"] = post.data.board.name;
            tempObject.objectType = "Activity"
            tempObject.id = "https://trello.com/b/" + post.data.board.shortLink;
            stmt.context.contextActivities.other.push(tempObject);

            tempObject = lrs.object();
            tempObject.definition.name["en-US"] = post.data.list.name;
            tempObject.objectType = "Activity"
            tempObject.definition.type = "http://id.tincanapi.com/activitytype/category";
            stmt.context.contextActivities.other.push(tempObject);

        break;
        case "createCard":
            stmt.verb.id = "http://activitystrea.ms/create";
            stmt.verb.display["en-US"] = "created";
            stmt.object.id = "https://trello.com/c/" + post.data.card.shortLink;
            stmt.object.definition.name["en-US"] = post.data.card.name;
            stmt.object.definition.description["en-US"] = "Trello Card";

            var tempObject = lrs.object();
            tempObject.definition.name["en-US"] = post.data.board.name;
            tempObject.objectType = "Activity"
            tempObject.id = "https://trello.com/b/" + post.data.board.shortLink;
            stmt.context.contextActivities.other.push(tempObject);

            tempObject = lrs.object();
            tempObject.definition.name["en-US"] = post.data.list.name;
            tempObject.objectType = "Activity"
            tempObject.definition.type = "http://id.tincanapi.com/activitytype/category";
            stmt.context.contextActivities.other.push(tempObject);

        break;
        /* case "addMemberToBoard":
            stmt.verb.id = "http://activitystrea.ms/add";
            stmt.verb.display["en-US"] = "added"
        break; */
        case "createBoard":
            stmt.verb.id = "http://activitystrea.ms/create";
            stmt.verb.display["en-US"] = "created";
            stmt.object.id = "https://trello.com/b/" + post.data.board.shortLink;
            stmt.object.definition.name["en-US"] = post.data.board.name;
            stmt.object.definition.description["en-US"] = "Trello Board";

        break;
    }

    return stmt;
}


function trello(posts, useremail) {
    let statements = [];
    let supported_actions = ["commentCard", "createBoard", "updateCard", "createCard"]; // temporary until all stmts implemented (there's a lot for trello)

    for (post of posts) {
        let stmt = lrs.statement();
        if (supported_actions.indexOf(post.type) != -1) {
            stmt.actor.objectType = "Agent";
            stmt.actor.account.name = useremail;
            stmt.actor.account.homePage = "http://temporaryHomepageUrl.com/" + post.idMemberCreator;
            stmt = trelloStmtMap(stmt, post);
            statements.push(stmt);
        }

    }

    return statements;
}

function slack(posts, useremail) {
    let statements = [];
    let channel = posts.channel;
    posts.forEach( (post) => {
        let stmt = lrs.statement();
        stmt.actor.objectType = "Agent";
        stmt.actor.account.name = useremail;
        stmt.actor.account.homePage = "http://uts-cic.slack.com/messages/" + post.user;
        stmt.verb.id = "http://activitystrea.ms/create";
        stmt.verb.display["en-US"] = "created";
        stmt.object.id=post.url.permalink;
        stmt.object.objectType ="Activity";
        stmt.object.definition.name["en-US"] = "Slack Message";
        stmt.object.definition.description["en-US"] = post.text;
        stmt.context.platform = "Slack";
        statements.push(stmt);
    });
    return statements;
}

function github(posts, useremail) {
    let statements = [];
    posts.forEach( (post) => {
        let stmt = lrs.statement();
        stmt.actor.objectType = "Agent";
        stmt.actor.account.name = useremail;
        if (post.author) {
            stmt.actor.account.homePage = "http://github.com/" + post.author.login;
        }
        if (post.owner) {
            stmt.actor.account.homePage = "http://github.com/" + post.owner.login;
        }
        stmt.verb.id = "http://activitystrea.ms/create";
        stmt.verb.display["en-US"] = "created";
        stmt.object.id = post.url;
        stmt.object.objectType ="Activity";
        stmt.object.definition.name["en-US"] = "GitHub";
        if (post.message) {
            stmt.object.definition.description["en-US"] = post.message;
        } else {
            stmt.object.definition.description["en-US"] = post.name;
        }
        stmt.context.platform = "GitHub";
        if (post.files) {
            post.files.forEach( (file) => {
                var tempObject = lrs.object();
                tempObject.definition.name["en-US"] = file.filename
                tempObject.objectType = "Activity"
                tempObject.definition.type = "http://activitystrea.ms/tag"
                stmt.context.contextActivities.other.push(tempObject)
            });
        }
        statements.push(stmt);
    });
    return statements;
}

module.exports = function(post, type, email) {
    switch(type) {
        case 'twitter': 
            return twitter(post, email)
            break;
        case 'slack': 
            return slack(post, email)
            break;
        case 'github':
            return github(post, email)
            break;
        case 'trello':
            return trello(post, email);
            break;
    }
}