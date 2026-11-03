import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://varakwelfare.org"),
  title: {
    default: "Varak Cancer Welfare Society - Cancer Crowdfunding in India",
    template: "%s | Varak Cancer Welfare Society",
  },
  description:
    "India's trusted cancer crowdfunding platform. Help cancer patients get the treatment they deserve with 0% platform fee. Start a fundraiser or donate today.",
  keywords: [
    "cancer crowdfunding",
    "cancer fundraising India",
    "medical crowdfunding",
    "cancer treatment funding",
    "donate for cancer patients",
    "Varak Welfare Society",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Varak Cancer Welfare Society",
    title: "Varak Cancer Welfare Society - Every Life Deserves a Fighting Chance",
    description:
      "India's trusted cancer crowdfunding platform with 0% platform fee.",
    images: ["/logo.png"], // shortcut: logo as share image, replace with a 1200x630 banner
  },
  twitter: {
    card: "summary_large_image",
    title: "Varak Cancer Welfare Society",
    description: "India's trusted cancer crowdfunding platform with 0% platform fee.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={jetbrainsMono.variable}>
        <body className="font-sans antialiased bg-background text-foreground">
          <TooltipProvider>{children}</TooltipProvider>
          <Analytics />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "NGO",
                name: "Varak Cancer Welfare Society",
                url: process.env.NEXT_PUBLIC_APP_URL || "https://varakwelfare.org",
                logo: `${process.env.NEXT_PUBLIC_APP_URL || "https://varakwelfare.org"}/logo.png`,
              }),
            }}
          />
          <Script src="https://www.googletagmanager.com/gtag/js?id=G-WKHLCFXYPS" strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-WKHLCFXYPS');`}
          </Script>
        </body>
      </html>
    </ClerkProvider>
  );
}
