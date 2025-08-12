import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // المرسل إليه (المستخدم)
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // المرسل
    message: { type: String },
    date: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
