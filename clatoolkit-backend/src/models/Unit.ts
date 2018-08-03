import * as mongoose from "mongoose";

export type UnitModel = mongoose.Document & {
  name: string,
  code: string,
  semester: string,
  description: string,
  ethics_statement: string,

  start_date: Date,
  end_date: Date,
  users: string[],
  enabled: boolean,
  platforms: UnitPlatform[],
  attached_user_platforms: string[], // UserUnitPlatform[],
  lrs: string,
  // retrieval_criterion: CourseRetrievalCriterion,

	created_by: string
};
// tslint:disable-next-line:interface-name
export interface UnitPlatform {
	platform: string;
	[key: string]: string;
}

export interface UserUnitPlatform {
	platform: string;
	[key: string]: string;
}

const unitSchema = new mongoose.Schema({
	name: String,
	code: String,
	semester: String,
	description: String,
	ethics_statement: String,

	start_date: Date,
	end_date: Date,
	enabled: Boolean,

	users: Array,
	platforms: Array,
	attached_user_platforms: Array,

	created_by: String 


}, { timestamps: true });

const Unit = mongoose.model<UnitModel>("Unit", unitSchema);
export default Unit;










