import Message from '../models/userMangment/Message.model.js';

// إنشاء رسالة جديدة
export const createMessageService = async (data) => {
  const { userId, fromUserId, message } = data;
  if (!userId || !fromUserId || !message) {
    throw new Error('userId, fromUserId, and message are required');
  }
  const allowed = { userId, fromUserId, message };
  return await Message.create(allowed);
};

// جلب الرسائل الخاصة بمستخدم معين (كمستلم أو كمرسل)
export const getMessagesForUserService = async (userId) => {
  return await Message.find({
    $or: [{ userId }, { fromUserId: userId }]
  }).sort({ createdAt: -1 });
};

// جلب جميع الرسائل
export const getAllMessagesService = async () => {
  return await Message.find().sort({ createdAt: -1 });
};

// تحديث حالة قراءة الرسالة
export const updateMessageStatusService = async (id, readStatus) => {
  const message = await Message.findByIdAndUpdate(
    id,
    { read: readStatus },
    { new: true }
  );
  if (!message) throw new Error('Message not found');
  return message;
};

// حذف رسالة
export const deleteMessageService = async (id) => {
  const message = await Message.findByIdAndDelete(id);
  if (!message) throw new Error('Message not found');
  return message;
};
