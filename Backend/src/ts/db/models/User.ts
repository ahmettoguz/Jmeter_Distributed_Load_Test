const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const userSchema = new Schema(
  {
    name: String,
    currentTestCount: Number,
    tier: { type: Types.ObjectId, ref: "Tier", required: true },
    userName: String,
    password: String,
  },
  { versionKey: false, timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;