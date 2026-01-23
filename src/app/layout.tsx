import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

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
  title: "FrontierMinds | AI-Powered Interactive Learning",
  description: "Transform complex textbooks into engaging, interactive learning experiences. Free courses in probability, financial mathematics, and more.",
  keywords: ["learning", "education", "probability", "actuarial", "exam p", "interactive", "AI"],
  authors: [{ name: "Carlos Verdugo", url: "https://frontierminds.io" }],
  creator: "FrontierMinds LLC",
  openGraph: {
    title: "FrontierMinds | AI-Powered Interactive Learning",
    description: "Transform complex textbooks into engaging, interactive learning experiences.",
    url: "https://frontierminds.io",
    siteName: "FrontierMinds",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FrontierMinds | AI-Powered Interactive Learning",
    description: "Transform complex textbooks into engaging, interactive learning experiences.",
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
        {children}
      </body>
    </html>
  );
}
