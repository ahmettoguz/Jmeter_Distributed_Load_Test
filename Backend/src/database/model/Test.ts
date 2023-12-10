import mongoose, { Types, Schema, Document, Model, model } from "mongoose";

interface ITest extends Document {
    name: String; 
    userId:{ type: Types.ObjectId; ref: "User"; required: true };
    finishedAt: String;
    virtualUser: Number;
    status: String;
    state: String;
}

mongoose.pluralize(null);
const testSchema = new Schema<ITest>(
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

const Test: Model<ITest> = model<ITest>("Test", testSchema);

export default Test;
