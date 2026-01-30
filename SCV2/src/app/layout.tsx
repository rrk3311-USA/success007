import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-medusa" });

export const metadata: Metadata = {
  title: "Success Chemistry – Premium Supplements | SCV2",
  description:
    "Premium dietary supplements and vitamins made in USA. Medusa storefront.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 via-white to-sky-50 font-sans antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
