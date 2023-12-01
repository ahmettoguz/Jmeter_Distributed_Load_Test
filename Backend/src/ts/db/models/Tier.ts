const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const tierSchema = new Schema(
  {
    name: String,
    virtualUser: Number,
    testDuration: Number,
    testCount: Number,
    parallelTest: Number,
  },
  { versionKey: false, timestamps: true }
);

const Tier = mongoose.model("Tier", tierSchema);

export default Tier;
