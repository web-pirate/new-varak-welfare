import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { syncUser } from "@/server/actions/sync-user";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Varak Cancer Welfare Society - Every Life Deserves a Fighting Chance",
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Varak Cancer Welfare Society",
    description: "India's trusted cancer crowdfunding platform with 0% platform fee.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();
  if (userId) {
    // A DB failure must not take down every page for signed-in users.
    await syncUser().catch((e) => console.error("syncUser failed", e));
  }

  return (
    <ClerkProvider>
      <html lang="en" className={jetbrainsMono.variable}>
        <body className="font-sans antialiased bg-background text-foreground">
          <TooltipProvider>{children}</TooltipProvider>
          <Analytics />
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
