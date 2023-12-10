import mongoose, { Types, Schema, Document, Model, model } from "mongoose";

mongoose.pluralize(null);
const testSchema = new Schema(
  {
    name: { type: String, lowercase: true, required: true },
    userId: { type: Types.ObjectId, ref: "User", required: true },
    finishedAt: { type: String, default: "null" },
    virtualUser: { type: Number, required: true },
    status: { type: String, lowercase: true, required: true, default: "running" },
    state: { type: String, lowercase: true, required: true, default: "success" },
  },
  { versionKey: false, timestamps: true }
);

const Test = mongoose.model("Test", testSchema);

export default Test;
