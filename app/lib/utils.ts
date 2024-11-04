import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function getBaseUrl() {
  if (typeof window === "undefined") {
    return process.env.PUBLIC_BASE_URL;
  } else {
    return window.env.PUBLIC_BASE_URL;
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
