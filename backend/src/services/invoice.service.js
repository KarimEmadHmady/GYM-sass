import Invoice from "../models/FinancialManagement/Invoice.js";
import Revenue from "../models/FinancialManagement/Revenue.js";

const parseDateRange = (from, to) => {
  const range = {};
  if (from) range.$gte = new Date(from);
  if (to) {
    const end = new Date(to);
    if (!to.includes("T")) end.setHours(23, 59, 59, 999);
    range.$lte = end;
  }
  return Object.keys(range).length ? range : undefined;
};

export const createInvoiceService = async (data) => {
  const allowed = {
    invoiceNumber: data.invoiceNumber,
    userId: data.userId,
    amount: data.amount,
    issueDate: data.issueDate,
    dueDate: data.dueDate,
    status: data.status,
    items: data.items,
    notes: data.notes,
  };
  return await Invoice.create(allowed);
};

export const getInvoicesService = async (filters) => {
  const { userId, invoiceNumber, status, minAmount, maxAmount, from, to, sort = "desc", limit = 50, skip = 0 } = filters;
  const q = {};
  const dateRange = parseDateRange(from, to);
  if (userId) q.userId = userId;
  if (invoiceNumber) q.invoiceNumber = invoiceNumber;
  if (status) q.status = status;
  if (dateRange) q.issueDate = dateRange;
  if (minAmount || maxAmount) {
    q.amount = {};
    if (minAmount) q.amount.$gte = Number(minAmount);
    if (maxAmount) q.amount.$lte = Number(maxAmount);
  }

  const rows = await Invoice.find(q)
    .sort({ issueDate: sort === "asc" ? 1 : -1 })
    .skip(Number(skip))
    .limit(Number(limit))
    .lean();
  const count = await Invoice.countDocuments(q);
  return { count, results: rows };
};

export const getInvoiceByIdService = async (id) => {
  return await Invoice.findById(id);
};

export const updateInvoiceService = async (id, data) => {
  // fetch original to detect status change
  const original = await Invoice.findById(id);
  if (!original) return null;

  const updated = await Invoice.findByIdAndUpdate(id, data, { new: true });

  // create Revenue on transition to paid
  if (updated && data && data.status === "paid" && original.status !== "paid") {
    try {
      await Revenue.create({
        amount: updated.amount,
        date: new Date(),
        paymentMethod: "cash",
        sourceType: "invoice",
        userId: updated.userId,
        notes: `Auto revenue for invoice ${updated.invoiceNumber}`,
      });
    } catch (e) {
      // swallow to not break invoice flow; optionally log
      // console.error('Failed to create revenue for paid invoice', e);
    }
  }

  return updated;
};

export const getInvoiceSummaryService = async (filters) => {
  const { from, to, userId, status, sort = "asc" } = filters;
  const match = {};
  const dateRange = parseDateRange(from, to);
  if (dateRange) match.issueDate = dateRange;
  if (userId) match.userId = userId;
  if (status) match.status = status;

  const [monthly, totalDoc] = await Promise.all([
    Invoice.aggregate([
      { $match: match },
      {
        $group: {
          _id: { year: { $year: "$issueDate" }, month: { $month: "$issueDate" } },
          total: { $sum: "$amount" },
          paid: { $sum: { $cond: [{ $eq: ["$status", "paid"] }, "$amount", 0] } },
          pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, "$amount", 0] } },
          overdue: { $sum: { $cond: [{ $eq: ["$status", "overdue"] }, "$amount", 0] } },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]),
    Invoice.aggregate([{ $match: match }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
  ]);

  const formatted = monthly
    .map((m) => ({ year: m._id.year, month: m._id.month, total: m.total, paid: m.paid, pending: m.pending, overdue: m.overdue }))
    .sort((a, b) => {
      if (a.year !== b.year) return (a.year - b.year) * (sort === "asc" ? 1 : -1);
      return (a.month - b.month) * (sort === "asc" ? 1 : -1);
    });

  return {
    range: { from: from || null, to: to || null },
    totals: { amount: totalDoc[0]?.total || 0 },
    monthly: formatted,
  };
};

export const deleteInvoiceService = async (id) => {
  return await Invoice.findByIdAndDelete(id);
};


