import * as purchaseService from "../services/purchase.service.js";

// إنشاء عملية شراء جديدة
export const createPurchase = async (req, res) => {
  try {
    const purchase = await purchaseService.createPurchase({
      ...req.body,
      userId: req.user.id, // جلب معرف المستخدم من التوكن
    });
    res.status(201).json(purchase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// جلب كل المشتريات لمستخدم
export const getPurchases = async (req, res) => {
  try {
    const purchases = await purchaseService.getPurchasesByUser(req.user.id);
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// جلب عملية شراء واحدة
export const getPurchase = async (req, res) => {
  try {
    const purchase = await purchaseService.getPurchaseById(req.params.id);
    if (!purchase) return res.status(404).json({ message: "عملية الشراء غير موجودة" });
    res.json(purchase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// تحديث عملية شراء
export const updatePurchase = async (req, res) => {
  try {
    const updated = await purchaseService.updatePurchase(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "عملية الشراء غير موجودة" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// حذف عملية شراء
export const deletePurchase = async (req, res) => {
  try {
    const deleted = await purchaseService.deletePurchase(req.params.id);
    if (!deleted) return res.status(404).json({ message: "عملية الشراء غير موجودة" });
    res.json({ message: "تم حذف عملية الشراء بنجاح" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
