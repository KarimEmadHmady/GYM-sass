import {
    createClientProgressService,
    getClientProgressByUserService,
    updateClientProgressService,
    deleteClientProgressService
  } from '../services/clientProgress.service.js';
  
  // إنشاء سجل تقدم جديد
  export const createClientProgress = async (req, res) => {
    try {
      const progress = await createClientProgressService(req.body);
      res.status(201).json(progress);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  // جلب كل السجلات لمستخدم
  export const getClientProgressByUser = async (req, res) => {
    try {
      const progress = await getClientProgressByUserService(req.params.userId);
      res.status(200).json(progress);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };
  
  // تعديل سجل تقدم
  export const updateClientProgress = async (req, res) => {
    try {
      const progress = await updateClientProgressService(req.params.id, req.body);
      res.status(200).json(progress);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  // حذف سجل تقدم
  export const deleteClientProgress = async (req, res) => {
    try {
      await deleteClientProgressService(req.params.id);
      res.status(204).send();
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  