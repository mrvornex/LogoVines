import mongoose, { Schema, models } from "mongoose";

const LogoSchema = new Schema(
  {
    imageUrl:        { type: String, required: true },
    cloudinaryId:    { type: String, default: null },
    title:           { type: String, required: true },
    desc:            { type: String, required: true },
    category:        { type: String, default: "Uncategorized" },
    folderName:      { type: String, default: null },
    type:            { type: String, enum: ["brand", "template"], default: "brand" },
    uploadedBy:      { type: Schema.Types.ObjectId, ref: "User", default: null },
    status:          { type: String, enum: ["pending", "approved", "rejected"], default: "approved" },
  },
  { timestamps: true }
);

const Logo = models.Logo || mongoose.model("Logo", LogoSchema);
export default Logo;