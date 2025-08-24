import Joi from 'joi';

// Schema لإضافة نقاط ولاء
export const addPointsSchema = Joi.object({
  userId: Joi.string().required().messages({
    'string.empty': 'معرف المستخدم مطلوب',
    'any.required': 'معرف المستخدم مطلوب'
  }),
  points: Joi.number().positive().required().messages({
    'number.base': 'النقاط يجب أن تكون رقم',
    'number.positive': 'النقاط يجب أن تكون رقم موجب',
    'any.required': 'عدد النقاط مطلوب'
  }),
  reason: Joi.string().min(3).max(200).required().messages({
    'string.empty': 'سبب إضافة النقاط مطلوب',
    'string.min': 'سبب إضافة النقاط يجب أن يكون 3 أحرف على الأقل',
    'string.max': 'سبب إضافة النقاط يجب أن يكون 200 حرف كحد أقصى',
    'any.required': 'سبب إضافة النقاط مطلوب'
  })
});

// Schema لاستبدال نقاط الولاء
export const redeemPointsSchema = Joi.object({
  userId: Joi.string().required().messages({
    'string.empty': 'معرف المستخدم مطلوب',
    'any.required': 'معرف المستخدم مطلوب'
  }),
  points: Joi.number().positive().required().messages({
    'number.base': 'النقاط يجب أن تكون رقم',
    'number.positive': 'النقاط يجب أن تكون رقم موجب',
    'any.required': 'عدد النقاط مطلوب'
  }),
  reward: Joi.string().min(3).max(200).required().messages({
    'string.empty': 'المكافأة المستبدلة مطلوبة',
    'string.min': 'المكافأة يجب أن تكون 3 أحرف على الأقل',
    'string.max': 'المكافأة يجب أن تكون 200 حرف كحد أقصى',
    'any.required': 'المكافأة المستبدلة مطلوبة'
  })
});

// Schema لإضافة نقاط من الدفع
export const paymentPointsSchema = Joi.object({
  userId: Joi.string().required().messages({
    'string.empty': 'معرف المستخدم مطلوب',
    'any.required': 'معرف المستخدم مطلوب'
  }),
  amount: Joi.number().positive().required().messages({
    'number.base': 'المبلغ يجب أن يكون رقم',
    'number.positive': 'المبلغ يجب أن يكون رقم موجب',
    'any.required': 'المبلغ مطلوب'
  }),
  paymentType: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'نوع الدفع مطلوب',
    'string.min': 'نوع الدفع يجب أن يكون 3 أحرف على الأقل',
    'string.max': 'نوع الدفع يجب أن يكون 100 حرف كحد أقصى',
    'any.required': 'نوع الدفع مطلوب'
  })
});

// Schema لإضافة نقاط الحضور
export const attendancePointsSchema = Joi.object({
  userId: Joi.string().required().messages({
    'string.empty': 'معرف المستخدم مطلوب',
    'any.required': 'معرف المستخدم مطلوب'
  }),
  attendanceStreak: Joi.number().integer().min(1).max(30).required().messages({
    'number.base': 'عدد أيام الحضور يجب أن يكون رقم',
    'number.integer': 'عدد أيام الحضور يجب أن يكون رقم صحيح',
    'number.min': 'عدد أيام الحضور يجب أن يكون 1 على الأقل',
    'number.max': 'عدد أيام الحضور يجب أن يكون 30 كحد أقصى',
    'any.required': 'عدد أيام الحضور مطلوب'
  })
});

// Schema للتحقق من معرف المستخدم
export const userIdSchema = Joi.object({
  userId: Joi.string().required().messages({
    'string.empty': 'معرف المستخدم مطلوب',
    'any.required': 'معرف المستخدم مطلوب'
  })
});

// Schema للتحقق من limit في top users
export const topUsersSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(50).optional().messages({
    'number.base': 'الحد يجب أن يكون رقم',
    'number.integer': 'الحد يجب أن يكون رقم صحيح',
    'number.min': 'الحد يجب أن يكون 1 على الأقل',
    'number.max': 'الحد يجب أن يكون 50 كحد أقصى'
  })
});
