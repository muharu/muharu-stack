export function getBaseUrl() {
  if (typeof window === "undefined") {
    return process.env.PUBLIC_BASE_URL;
  } else {
    return window.env.PUBLIC_BASE_URL;
  }
}