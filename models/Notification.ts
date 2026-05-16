import mongoose, { Schema, models } from "mongoose";

const NotificationSchema = new Schema(
  {
    userId:  { type: Schema.Types.ObjectId, ref: "User", required: true },
    type:    { type: String, enum: ["upload_success", "approved", "rejected"], required: true },
    message: { type: String, required: true },
    logoId:  { type: Schema.Types.ObjectId, ref: "Logo", default: null },
    read:    { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = models.Notification || mongoose.model("Notification", NotificationSchema);
export default Notification;