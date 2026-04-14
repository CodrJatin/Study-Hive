import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StudyHive – The Living Cell Study Platform",
  description:
    "A syllabus-centric study space where academic groups collaborate, track progress, and conquer their curriculum together.",
  keywords: ["study", "education", "syllabus", "hive", "collaboration"],
  openGraph: {
    title: "StudyHive – The Living Cell Study Platform",
    description: "Syllabus-centric collaborative studying for academic groups.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-surface)] antialiased">
        {children}
      </body>
    </html>
  );
}
