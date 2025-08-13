import Feedback from '../models/userMangment/Feedback.model.js';

// إنشاء تقييم جديد
export const createFeedbackService = async (data) => {
  return await Feedback.create(data);
};

// جلب التقييمات الخاصة بمستخدم معين
export const getFeedbackForUserService = async (userId) => {
  return await Feedback.find({ toUserId: userId }).sort({ createdAt: -1 });
};

// تعديل تقييم
export const updateFeedbackService = async (id, data) => {
  const feedback = await Feedback.findByIdAndUpdate(id, data, { new: true });
  if (!feedback) throw new Error('Feedback not found');
  return feedback;
};

// حذف تقييم
export const deleteFeedbackService = async (id) => {
  const feedback = await Feedback.findByIdAndDelete(id);
  if (!feedback) throw new Error('Feedback not found');
  return feedback;
};
