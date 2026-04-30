import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { InstallPWA } from "@/components/InstallPWA";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-headline",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcf9f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f12" },
  ],
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://studyhive.vercel.app"),
  title: "StudyHive | The Academic Atelier",
  description: "Organize by topic, conquer by Track. Your academic workspace.",
  applicationName: "StudyHive",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "StudyHive",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { url: "/icons/maskable-512.png", rel: "mask-icon" },
    ],
  },
  openGraph: {
    type: "website",
    title: "StudyHive | The Academic Atelier",
    description: "Organize by topic, conquer by Track.",
    images: [{ url: "/icons/icon-512.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} ${plusJakartaSans.variable} antialiased selection:bg-secondary-container selection:text-on-secondary-container`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster 
            richColors 
            closeButton
            position="bottom-right" 
            theme="system" 
            toastOptions={{
              style: {
                fontFamily: 'var(--font-body)',
                borderRadius: '1.25rem',
              },
              className: "clay-card !bg-surface-container-lowest !text-on-surface !border-outline-variant/20 !shadow-2xl !p-4",
            }}
          />
          <InstallPWA />
          <SpeedInsights />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
