import {
    createPaymentService,
    getPaymentsByUserService,
    updatePaymentService,
    deletePaymentService,
    getAllpaymentsService
  } from '../services/payment.service.js';
  
  // ➕ إنشاء دفعة جديدة
  export const createPayment = async (req, res) => {
    try {
      const payment = await createPaymentService(req.body);
      res.status(201).json(payment);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  // 📄 جلب جميع الدفعات لمستخدم
  export const getPaymentsByUser = async (req, res) => {
    try {
      const payments = await getPaymentsByUserService(req.params.userId);
      res.status(200).json(payments);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };

  // جلب جميع الدفعات
  export const getAllPayments = async (req, res) => {
    try {
      const payments = await getAllpaymentsService();
      res.status(200).json(payments);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  // ✏️ تعديل دفعة
  export const updatePayment = async (req, res) => {
    try {
      const payment = await updatePaymentService(req.params.id, req.body);
      res.status(200).json(payment);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  // 🗑️ حذف دفعة
  export const deletePayment = async (req, res) => {
    try {
      await deletePaymentService(req.params.id);
      res.status(204).send();
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  