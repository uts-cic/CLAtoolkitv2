import * as bcrypt from "bcrypt-nodejs";
import * as crypto from "crypto";
import * as mongoose from "mongoose";

export type UserModel = mongoose.Document & {
  email: string,
  password: string,
  passwordResetToken: string,
  passwordResetExpires: Date,

  tokens: AuthToken[],

  profile: {
    name: string,
    socialMediaUserIds: { [key: string]: string }
  },

  comparePassword: (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void
};

// tslint:disable-next-line:interface-name
export interface AuthToken {
  accessToken: string;
  accessSecret: string;
  platform: string;
}

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  passwordResetExpires: Date,
  passwordResetToken: String,

  profile: {
    name: String,
    socialMediaUserIds: Object
  },

  tokens: Array,
  facebook: String,
  google: String,
  twitter: String,
}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword: string, cb: (err: any, isMatch: any) => {}) {
  bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
    cb(err, isMatch);
  });
};

// export const User: UserType = mongoose.model<UserType>('User', userSchema);
const User = mongoose.model<UserModel>("User", userSchema);
export default User;
