import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';

// Load the ABCDiatype font (Regular and Bold only)
const abcdDiatype = localFont({
  src: [
    { path: "./fonts/ABCDiatype-Regular.otf", weight: "400" },
    { path: "./fonts/ABCDiatype-Bold.otf", weight: "700" },
  ],
  variable: "--font-abcd-diatype",
});

// Load the Reckless font (Regular and Medium only)
const reckless = localFont({
  src: [
    { path: "./fonts/RecklessTRIAL-Regular.woff2", weight: "400" },
    { path: "./fonts/RecklessTRIAL-Medium.woff2", weight: "500" },
  ],
  variable: "--font-reckless",
});

export const metadata: Metadata = {
  title: "Roast My Website",
  description: "Get honest feedback and critiques for your website",
  openGraph: {
    title: "Roast My Website",
    description: "Get honest feedback and critiques for your website",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://roastmywebsite.exa.ai/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Roast My Website"
      }
    ]
  },
  twitter: {
    card: "summary_large_image", 
    title: "Roast My Website",
    description: "Get honest feedback and critiques for your website",
    images: ["https://roastmywebsite.exa.ai/opengraph-image.jpg"]
  },
  metadataBase: new URL("https://roastmywebsite.exa.ai"),
  robots: {
    index: true,
    follow: true
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${abcdDiatype.variable} ${reckless.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}