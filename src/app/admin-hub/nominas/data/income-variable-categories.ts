export const INCOME_VARIABLE_CATEGORIES = [
  "Bonus",
  "Reimbursement",
  "Invoice Expense",
  "Referral",
  "Other",
] as const;

export type IncomeVariableCategory = (typeof INCOME_VARIABLE_CATEGORIES)[number];

export const INCOME_VARIABLE_CATEGORY_OPTIONS = INCOME_VARIABLE_CATEGORIES.map(
  (value) => ({ value, label: value }),
);
