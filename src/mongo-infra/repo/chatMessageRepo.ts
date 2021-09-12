import mongoose from 'mongoose';
import { ChatMessage } from '../../domain/Message';

const chatMessageSchema = new mongoose.Schema<ChatMessage>({
  id: String,
  avatar: String,
  userRole: String,
  brodcaster: Boolean,
  displayName: String,
  username: String,
  message: String,
  timestamp: String,
});
export const ChatMessageRepo = mongoose.model('ChatMessage', chatMessageSchema);
