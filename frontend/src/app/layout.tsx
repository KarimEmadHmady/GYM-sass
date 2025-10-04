import type { Metadata } from "next";
import { Cairo, Roboto } from "next/font/google"; // ✅ ضفنا Cairo و Roboto
import "./globals.css";
import ClientOnlineSync from "@/components/ClientOnlineSync";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["200","300","400","500","600","700","800","900"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300","400","500","700"],
});

export const metadata: Metadata = {
  title: "EL-Coach GYM",
  description: "إدارة صالة الألعاب الرياضية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/logo192.png" />
        <link rel="shortcut icon" href="/logo512.png" />
        {/* أي meta tags إضافية للـ PWA */}
      </head>
      {/* ✅ Cairo + Roboto */}
      <body className={`${cairo.variable} ${roboto.variable} antialiased`}>
        {children}
        {/* Initialize online listener in a client component */}
        <ClientOnlineSync />
      </body>
    </html>
  );
}
