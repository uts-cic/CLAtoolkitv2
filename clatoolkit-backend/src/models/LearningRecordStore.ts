import * as crypto from "crypto";
import * as mongoose from "mongoose";

export let CreateLrsFromData = (frontEndLrsData: any, userId: string) => {
	const configObj = {
		basic_auth: {
			key: <any>undefined,
			secret: <any>undefined,
			enabled: false
		},
		token: {
			enabled: false
		}
	};

	let token;
	if (frontEndLrsData.auth_type == "basic_auth") {
		configObj.basic_auth.key = frontEndLrsData.config.basic_auth.key;
		configObj.basic_auth.secret = frontEndLrsData.config.basic_auth.secret;
		configObj.basic_auth.enabled = true;
		token = Buffer.from(configObj.basic_auth.key + ":" + configObj.basic_auth.secret)
			.toString("base64");
	} else if (frontEndLrsData.auth_type == "token") {
		configObj.token.enabled = true;
		token = frontEndLrsData.config.token;
	}

	const userDefinedLrs = {
		name: frontEndLrsData.name,
		token: token,
		host: frontEndLrsData.endpoint,
		config: configObj,
		belongsTo: userId,
		type: "custom"
	};

	return userDefinedLrs;
};

export type LrsModel = mongoose.Document & {
	name: string,
	token: string, // The Auth token used to communicate with LRS
	host: string, // The xapi endpoint for the LRS "http://lrs.someoneslrs.com/statements/xAPI/"
	config: { // Config specifies how the LRS authentication 
		basic_auth: { 
			// if an lrs is configured using basic auth (username {key} & password {secret})
			// then the "token" above is generated as follows:
			// base64.encode(key:secret)
			key: string | undefined, 
			secret: string | undefined,
			enabled: boolean
		},
		token: {
			// Some LRS services provide a premade token - the "token" above is then just 
			// the provided token
			enabled: boolean
		}
	},
	belongsTo: string | undefined, // if the lrs is a custom provider given by a user, make a reference to the users account
	type: string // two types of LRS: "default" (the clatoolkit lrs), and "custom" (lrs provided by a user)
};

const LrsSchema = new mongoose.Schema({
	name: String,
	token: String,
	host: String,
	config: {
		basic_auth: {
			key: String,
			secret: String,
			enabled: Boolean
		},
		token: {
			enabled: Boolean
		}
	},
	belongsTo: String,
	type: String
}, { timestamps: true });

const LRS = mongoose.model<LrsModel>("Lrs", LrsSchema);
export default LRS;








