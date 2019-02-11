function cloneObject() {
	let object = {
		"definition": {
            "name": {"en-US": ""},
            "type": "http://activitystrea.ms/tag"
        	},
        "objectType": "",
        "id": "http://activitystrea.ms/schema/1.0.0"
	};
	return Object.assign({}, object);
}

function cloneStatement() {
    let statement = {
        "actor": {
            "account": {
            	"name": "",
            	"homePage": "",
            },
            "objectType": "Agent"
        },
        "verb": {
            "id": "",
            "display": {"en-US": ""}
        },
        "object": {
            "id": "",
            "definition": {
                "name": {},
                "description": {}
            },
            "objectType": "Activity"
        },
        "context": {
            "platform": "",
            "contextActivities": {
            	"other" : [ 
                ]
            }
        }
    };
    return Object.assign({}, statement);
}

module.exports.statement = function() {
    return cloneStatement();
}

module.exports.object = function() {
    return cloneObject();
}