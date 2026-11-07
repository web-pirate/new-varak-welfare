import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NumericValue = number | string | { toNumber(): number } | any;

function toNumber(val: NumericValue): number {
  if (typeof val === "number") return val;
  if (typeof val === "string") return parseFloat(val);
  if (val && typeof val.toNumber === "function") return val.toNumber();
  return Number(val);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: NumericValue): string {
  const num = toNumber(amount);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatNumber(num: number): string {
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export { slugify } from "./slug";

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** Rupees still needed, never negative. */
export function amountToGo(raised: NumericValue, goal: NumericValue): number {
  return Math.max(toNumber(goal) - toNumber(raised), 0);
}

export function calculateProgress(raised: NumericValue, goal: NumericValue): number {
  const r = toNumber(raised);
  const g = toNumber(goal);
  if (g === 0) return 0;
  return Math.min(Math.round((r / g) * 100), 100);
}

export function timeAgo(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 30) return past.toLocaleDateString("en-IN");
  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMins > 0) return `${diffMins}m ago`;
  return "just now";
}

export function daysLeft(endDate: Date | string): number {
  const end = new Date(endDate);
  const now = new Date();
  const diffMs = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}
