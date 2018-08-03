import * as mongoose from "mongoose";

export type UnitUserPlatformModel = mongoose.Document & {
	platform: string,
	// Platform Identifier is the social media attached to a unit
	// For e.g.: the ID of a particular trello board, slack channel, github board, etc,etc.
	platformIdentifier: string, 
	belongsTo: string, // User id
	[key: string]: string
};


const unitUserPlatformSchema = new mongoose.Schema({
	platform: String,
	platformIdentifier: String,
	belongsTo: String
});

const UnitUserPlatform = mongoose.model<UnitUserPlatformModel>("UnitUserPlatform", unitUserPlatformSchema);
export default UnitUserPlatform;
