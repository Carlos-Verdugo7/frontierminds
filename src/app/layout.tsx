import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SiteFooter, SiteHeader } from "@/components/site/SiteChrome";
import ProgressTracker from "@/components/learning/ProgressTracker";
import { TutorSettings } from "@/components/learning/TutorAvailability";

const GA_MEASUREMENT_ID = "G-6CDFK61KQ8";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.frontierminds.io"),
  title: "FrontierMinds | Learning & Community",
  description: "Free interactive learning in data engineering with AI, probability, and Salesforce, plus practical Spanish community guides.",
  keywords: ["learning", "education", "probability", "actuarial", "exam p", "Salesforce", "data engineering", "Fivetran", "medallion architecture", "dbt", "DuckDB", "community", "West Palm Beach", "recursos en español"],
  authors: [{ name: "Carlos Verdugo", url: "https://frontierminds.io" }],
  creator: "FrontierMinds LLC",
  openGraph: {
    title: "FrontierMinds | Learning & Community",
    description: "Build a skill. Find your next step. Interactive courses and practical community guides in one place.",
    url: "https://frontierminds.io",
    siteName: "FrontierMinds",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FrontierMinds | Learning & Community",
    description: "Interactive learning paths and Spanish community resources for West Palm Beach families.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SiteHeader />
        <div id="site-content" tabIndex={-1}>
          <TutorSettings enabled={Boolean(process.env.OPENAI_API_KEY)}>{children}</TutorSettings>
          <ProgressTracker />
        </div>
        <SiteFooter />
      </body>
    </html>
  );
}

