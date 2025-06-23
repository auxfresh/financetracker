import { z } from "zod";

// Transaction schema
export const transactionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  description: z.string().min(1, "Description is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Category is required"),
  date: z.string(), // ISO date string
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const insertTransactionSchema = transactionSchema.omit({ 
  id: true, 
  userId: true,
  createdAt: true,
  updatedAt: true 
});

export type Transaction = z.infer<typeof transactionSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

// User schema
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;

// Categories
export const categories = {
  income: [
    { value: "salary", label: "Salary" },
    { value: "freelance", label: "Freelance" },
    { value: "business", label: "Business" },
    { value: "investment", label: "Investment" },
    { value: "other-income", label: "Other Income" },
  ],
  expense: [
    { value: "food", label: "Food & Dining" },
    { value: "transport", label: "Transportation" },
    { value: "entertainment", label: "Entertainment" },
    { value: "utilities", label: "Utilities" },
    { value: "healthcare", label: "Healthcare" },
    { value: "shopping", label: "Shopping" },
    { value: "other-expense", label: "Other Expense" },
  ],
};
