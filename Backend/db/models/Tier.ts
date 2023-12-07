import mongoose, { Types, Schema, Document, Model, model } from "mongoose";

interface ITier extends Document {
  name: String;
  virtualUser: Number;
  testDuration: Number;
  testCount: Number;
  parallelTest: Number;
}

mongoose.pluralize(null);
const tierSchema = new Schema<ITier>(
  {
    name: { type: String, lowercase: true },
    virtualUser: { type: Number, required: true },
    testDuration: { type: Number, required: true },
    testCount: { type: Number, required: true },
    parallelTest: { type: Number, required: true },
  },
  { versionKey: false, timestamps: true }
);

const Tier: Model<ITier> = model<ITier>("Tier", tierSchema);

export default Tier;
