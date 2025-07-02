import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
  sender: {
    type: String,
    enum: ["buyer", "seller"],
    required: true,
  },
  senderEmail: {
    type: String,
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  },
});

const chatSchema = new mongoose.Schema({
  adoptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Adoption",
    required: true,
    unique: true,
  },
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pet",
    required: true,
  },
  buyer: {
    email: { type: String, required: true },
    name: { type: String, required: true },
  },
  seller: {
    email: { type: String, required: true },
    name: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ["active", "closed"],
    default: "active",
  },
  lastMessage: {
    content: String,
    sender: String,
    timestamp: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for better performance
chatSchema.index({ adoptionId: 1 });
chatSchema.index({ "buyer.email": 1, "seller.email": 1 });
messageSchema.index({ chatId: 1, timestamp: -1 });

export const Chat = mongoose.model("Chat", chatSchema);
export const Message = mongoose.model("Message", messageSchema);