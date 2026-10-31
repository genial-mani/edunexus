import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(timestamp: number | string | Date): string {
  const date = typeof timestamp === "number" ? new Date(timestamp) : new Date(timestamp);
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export interface LocationTarget {
  city?: string | null;
  district?: string | null;
  state?: string | null;
}

export function calculateLocationScore(
  item: LocationTarget,
  target: LocationTarget
): number {
  if (!target.city && !target.district && !target.state) return 0;

  const norm = (s?: string | null) => (s || "").trim().toLowerCase();
  const targetCity = norm(target.city);
  const targetDistrict = norm(target.district);
  const targetState = norm(target.state);

  const itemCity = norm(item.city);
  const itemDistrict = norm(item.district);
  const itemState = norm(item.state);

  let score = 0;
  // Highest priority: exact city or village match
  if (targetCity && itemCity && (targetCity === itemCity || itemCity.includes(targetCity) || targetCity.includes(itemCity))) {
    score += 100;
  }
  // Second priority: district match
  if (targetDistrict && itemDistrict && (targetDistrict === itemDistrict || itemDistrict.includes(targetDistrict) || targetDistrict.includes(itemDistrict))) {
    score += 50;
  }
  // Third priority: state match
  if (targetState && itemState && (targetState === itemState || itemState.includes(targetState) || targetState.includes(itemState))) {
    score += 20;
  }

  return score;
}
