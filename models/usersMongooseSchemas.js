import { Schema, model } from "mongoose";

import { addSettings, handleSaveError } from "./hooks.js";

import { emailRegexp } from "../constants/user-constants.js";

const usersSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: emailRegexp,
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
    },
  },
  { versionKey: false }
);

usersSchema.post("save", handleSaveError);

usersSchema.pre("findOneAndUpdate", addSettings);

usersSchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", usersSchema);

export default User;
