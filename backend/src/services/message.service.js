import Message from '../models/userMangment/Message.model.js';

// إنشاء رسالة جديدة
export const createMessageService = async (data) => {
  const { userId, fromUserId, message, subject } = data;
  if (!userId || !fromUserId || !message) {
    throw new Error('userId, fromUserId, and message are required');
  }
  const allowed = { userId, fromUserId, message, subject };
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

// تحديث محتوى الرسالة
export const updateMessageService = async (id, data) => {
  const { message, subject } = data;
  const updateData = {};
  if (message) updateData.message = message;
  if (subject !== undefined) updateData.subject = subject;
  // إذا تم تعديل الرسالة أو الموضوع، أعد تعيين read إلى false
  if (message || subject !== undefined) updateData.read = false;
  const updatedMessage = await Message.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  );
  if (!updatedMessage) throw new Error('Message not found');
  return updatedMessage;
};

// حذف رسالة
export const deleteMessageService = async (id) => {
  const message = await Message.findByIdAndDelete(id);
  if (!message) throw new Error('Message not found');
  return message;
};

// تحديد الرسالة كمقروءة
export const markMessageAsReadService = async (id) => {
  const message = await Message.findByIdAndUpdate(
    id,
    { read: true },
    { new: true }
  );
  if (!message) throw new Error('Message not found');
  return message;
};