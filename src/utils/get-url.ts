// src/utils/get-url.ts

export const getBaseUrl = () => {
  // 1. If we are in the browser, use the current window location
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // 2. If we are on the server (during SSR or Server Actions)
  // Use the environment variable set by your hosting provider (like Vercel or Render)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // 3. Fallback for local development if the env variable isn't set
  return `http://localhost:${process.env.PORT || 3000}`;
};

export const getJoinUrl = (inviteCode: string) => {
  return `${getBaseUrl()}/join/${inviteCode}`;
};
