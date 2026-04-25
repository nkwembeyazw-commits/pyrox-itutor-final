import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { addDays } from "date-fns";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
/**
 * Standardizes the "Next Payment Due" calculation across the PyroX ecosystem.
 * @param lastPaidDate Timestamp of the last successful transaction.
 * @param interval Billing cycle: weekly or monthly.
 * @param enrollmentDate Fallback timestamp (createdAt) if no payment history exists.
 */
export function calculateNextDue(
  lastPaidDate: number | undefined,
  interval: "weekly" | "monthly" | undefined,
  enrollmentDate: number
): number {
  const base = lastPaidDate || enrollmentDate;
  const period = interval || "monthly";
  return addDays(new Date(base), period === "weekly" ? 7 : 30).getTime();
}
/**
 * Checks if a specific due date has passed.
 */
export function isOverdue(dueDate: number): boolean {
  return dueDate < Date.now();
}