var ADL = require('adl-xapiwrapper');
const db = require('../mongodbutils').getDb();
require('dotenv').load();

const statement = require('./statements');

/* var conf = {
    "url" : process.env.HOST_URL,  
    "auth" : {
        user : process.env.LRS_USERNAME,
        pass : process.env.LRS_PASSWORD
    }
};

var LRS = new ADL.XAPIWrapper(conf);
*/

function hashStmt(stmt) {
    stmt = JSON.stringify(stmt);

    return stmt.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              

}

// Filters statements if they've been sent already (based on hash)
async function filterIfSentAlready(stmtsArr) {
    var stmts = [];

    for (stmt of stmtsArr) {
        hashstmt = hashStmt(stmt);

        var exists = await db.collection('sentStmts').find({ hash: hashstmt }).limit(1).count();
        // console.log("exists: ", exists);
        if (!(exists >= 1)) {
            db.collection('sentStmts').insertOne({ hash: hashstmt}, (err, res) => {
                if (err) { console.log(err); }
            });
            stmts.push(stmt);
        }

    }

    return stmts;
}

// Upload to LRS
async function insertIntoLRS(posts, type, lrsconf, useremail) {

    // console.log("POSTS: ", posts);
    statements = statement(posts, type, useremail);
    
    statements = await filterIfSentAlready(statements);
    console.log("statements: ", statements);

    let result = statements.map( async (stmt) => {
        let ts = await insertLRS(stmt, lrsconf);
        return ts;
    });
    const data_extract = await Promise.all(result);
    return data_extract;
}

function insertLRS(stmts, lrsconf) {
    // Remove "/statements/" path from host paths
    // ADL wrapper adds this automatically
    var splitHost = lrsconf.host.split('/');
    if (splitHost.indexOf("statements") != -1) {
        var idx = splitHost.indexOf("statements");
        splitHost.splice(idx, splitHost.length - idx + 1);
    }
    lrsconf.host = splitHost.join("/");
    //

    var conf = {
        "url": lrsconf.host,
        "auth": {
            user: lrsconf.config.basic_auth.key,
            pass: lrsconf.config.basic_auth.secret
        }
    };

    var LRS = new ADL.XAPIWrapper(conf);

    return new Promise((resolve, reject) => {
        LRS.sendStatements(stmts, (err, res) => {
            if(err) return reject(err);
            console.log("LRS RESPONSE: ", res.body);
 
            return resolve('Added');
        });
    });
}

module.exports = async function(posts, type, lrs, useremail) {
    return await insertIntoLRS(posts, type, lrs, useremail);
}