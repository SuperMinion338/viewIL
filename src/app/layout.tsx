import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "ViewIL — כלי AI ליוצרי תוכן ישראלים",
  description:
    "כתוב סקריפטים, צור הוקים, נהל לוח תוכן ונתח ביצועים — הכל בעברית. הצטרף ל-1,000 יוצרים ישראלים.",
  keywords: "יוצרי תוכן ישראל, כלי AI עברית, סקריפט לסרטון, תוכן טיקטוק אינסטגרם",
  openGraph: {
    title: "ViewIL — כלי AI ליוצרי תוכן ישראלים",
    description: "כתוב סקריפטים, צור הוקים, נהל לוח תוכן ונתח ביצועים — הכל בעברית.",
    url: "https://viewil.com",
    images: [{ url: "/logo-transparent.png", width: 400, height: 400, alt: "ViewIL" }],
    locale: "he_IL",
    type: "website",
    siteName: "ViewIL",
  },
  twitter: {
    card: "summary",
    title: "ViewIL — כלי AI ליוצרי תוכן ישראלים",
    description: "כתוב סקריפטים, צור הוקים, נהל לוח תוכן — הכל בעברית.",
    images: ["/logo-transparent.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Hebrew:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
