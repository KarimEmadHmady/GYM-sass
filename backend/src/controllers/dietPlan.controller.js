import {
    createDietPlanService,
    getDietPlansByUserService,
    updateDietPlanService,
    deleteDietPlanService
  } from '../services/dietPlan.service.js';
  
  // إنشاء خطة غذائية جديدة
  export const createDietPlan = async (req, res) => {
    try {
      const plan = await createDietPlanService(req.body);
      res.status(201).json(plan);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  // جلب جميع الخطط الغذائية لمستخدم
  export const getDietPlansByUser = async (req, res) => {
    try {
      const plans = await getDietPlansByUserService(req.params.userId);
      res.status(200).json(plans);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };
  
  // تعديل خطة غذائية
  export const updateDietPlan = async (req, res) => {
    try {
      const plan = await updateDietPlanService(req.params.id, req.body);
      res.status(200).json(plan);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  // حذف خطة غذائية
  export const deleteDietPlan = async (req, res) => {
    try {
      await deleteDietPlanService(req.params.id);
      res.status(204).send();
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  