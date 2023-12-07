import mongoose, { Types, Schema, Document, Model, model } from "mongoose";

interface ITest extends Document {
  name: string;
  user: { type: Types.ObjectId; ref: "User"; required: true };
  isFinished: boolean;
  resultPath: string;
}

mongoose.pluralize(null);
const testSchema = new Schema<ITest>(
  {
    name: { type: String, lowercase: true, required: true },
    user: { type: Types.ObjectId, ref: "User", required: true },
    isFinished: { type: Boolean, default: false },
    resultPath: { type: String, default: "" },
  },
  { versionKey: false, timestamps: true }
);

const Test: Model<ITest> = model<ITest>("Test", testSchema);

export default Test;
