import { Schema, model } from "mongoose";
import { addSettings, handleSaveError } from "./hooks.js";

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false }
);

contactsSchema.post("save", handleSaveError);

contactsSchema.pre("findOneAndUpdate", addSettings);

contactsSchema.post("findOneAndUpdate", handleSaveError);

const Contact = model("contact", contactsSchema);

export default Contact;
