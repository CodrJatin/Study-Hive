// src/utils/get-url.ts

export const getBaseUrl = () => {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ??       // Set this manually in Vercel
    process.env.NEXT_PUBLIC_VERCEL_URL ??      // Automatically set by Vercel
    "http://localhost:3000";                   // Local fallback

  // 1. Ensure the protocol is included (Vercel URL lacks it)
  url = url.includes("http") ? url : `https://${url}`;

  // 2. Remove any trailing slash to prevent double slashes like //auth/callback
  url = url.endsWith("/") ? url.slice(0, -1) : url;

  return url;
};

export const getJoinUrl = (inviteCode: string) => {
  return `${getBaseUrl()}/join/${inviteCode}`;
};