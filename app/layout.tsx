import type React from "react";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "TJMathHub - Master Math, Fast & Fun!",
  description:
    "Sharpen your mental math skills with engaging, fast-paced quizzes and track your progress. Play now!",
  keywords: [
    "math quiz",
    "math game",
    "speed math",
    "mental math",
    "learn math",
    "TJMathHub",
  ],
  openGraph: {
    title: "TJMathHub - Master Math, Fast & Fun!",
    description:
      "Sharpen your mental math skills with engaging, fast-paced quizzes and track your progress. Play now!",
    url: "https://tjmathhub.vercel.app", // Replace with your actual deployment URL
    siteName: "TJMathHub",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200",
        width: 1200,
        height: 630,
        alt: "TJMathHub Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          poppins.variable,
        )}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
