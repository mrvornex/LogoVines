import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name:       { type: String, required: true, trim: true },
    username:   { type: String, required: true, unique: true, trim: true, lowercase: true },
    email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:   { type: String, required: true },
    role:       { type: String, enum: ["user", "admin"], default: "user" },

    // Email verification
    isVerified:       { type: Boolean, default: false },
    verifyToken:      { type: String,  default: null },
    verifyTokenExpiry:{ type: Date,    default: null },

    // Profile Settings
    country:   { type: String, default: "" },
    website:   { type: String, default: "" },
    facebook:  { type: String, default: "" },
    twitter:   { type: String, default: "" },
    instagram: { type: String, default: "" },
    pinterest: { type: String, default: "" },
    linkedin:  { type: String, default: "" },
    behance:   { type: String, default: "" },
    dribbble:  { type: String, default: "" },
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", UserSchema);
export default User;