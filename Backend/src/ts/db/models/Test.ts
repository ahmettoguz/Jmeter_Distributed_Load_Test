const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const testSchema = new Schema(
  {
    name: String,
    user: { type: Types.ObjectId, ref: "User", required: true },
    isFinished: Boolean,
  },
  { versionKey: false, timestamps: true }
);

const Test = mongoose.model("Test", testSchema);

export default Test;
