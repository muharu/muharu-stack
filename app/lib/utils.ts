import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getQueryParam(request: Request, key: string) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  return searchParams.get(key);
}

export function invariant(value: unknown, message: string) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}
