import Payroll from "../models/FinancialManagement/Payroll.js";

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

export const createPayrollService = async (data) => {
  const allowed = {
    employeeId: data.employeeId,
    salaryAmount: data.salaryAmount,
    paymentDate: data.paymentDate,
    bonuses: data.bonuses,
    deductions: data.deductions,
    notes: data.notes,
  };
  return await Payroll.create(allowed);
};

export const getPayrollsService = async (filters) => {
  const { employeeId, minAmount, maxAmount, from, to, sort = "desc", limit = 50, skip = 0 } = filters;
  const q = {};
  const dateRange = parseDateRange(from, to);
  if (employeeId) q.employeeId = employeeId;
  if (dateRange) q.paymentDate = dateRange;
  if (minAmount || maxAmount) {
    q.salaryAmount = {};
    if (minAmount) q.salaryAmount.$gte = Number(minAmount);
    if (maxAmount) q.salaryAmount.$lte = Number(maxAmount);
  }

  const rows = await Payroll.find(q)
    .sort({ paymentDate: sort === "asc" ? 1 : -1 })
    .skip(Number(skip))
    .limit(Number(limit))
    .lean();
  const count = await Payroll.countDocuments(q);
  return { count, results: rows };
};

export const getPayrollByIdService = async (id) => {
  return await Payroll.findById(id);
};

export const updatePayrollService = async (id, data) => {
  return await Payroll.findByIdAndUpdate(id, data, { new: true });
};

export const deletePayrollService = async (id) => {
  return await Payroll.findByIdAndDelete(id);
};

export const getPayrollSummaryService = async (filters) => {
  const { from, to, employeeId, sort = "asc" } = filters;
  const match = {};
  const dateRange = parseDateRange(from, to);
  if (dateRange) match.paymentDate = dateRange;
  if (employeeId) match.employeeId = employeeId;

  const monthly = await Payroll.aggregate([
    { $match: match },
    {
      $group: {
        _id: { year: { $year: "$paymentDate" }, month: { $month: "$paymentDate" } },
        totalSalary: { $sum: "$salaryAmount" },
        totalBonuses: { $sum: "$bonuses" },
        totalDeductions: { $sum: "$deductions" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const formatted = monthly
    .map((m) => ({
      year: m._id.year,
      month: m._id.month,
      salary: m.totalSalary,
      bonuses: m.totalBonuses,
      deductions: m.totalDeductions,
      net: m.totalSalary + m.totalBonuses - m.totalDeductions,
    }))
    .sort((a, b) => {
      if (a.year !== b.year) return (a.year - b.year) * (sort === "asc" ? 1 : -1);
      return (a.month - b.month) * (sort === "asc" ? 1 : -1);
    });

  return { range: { from: from || null, to: to || null }, monthly: formatted };
};


