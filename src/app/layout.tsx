import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "../components/Providers";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Ultimate Success Partners",
    default: "Ultimate Success Partners | Executive Education & SME Scaling",
  },
  description: "Bilingual (Thai/English) premium executive education, leadership masterclasses, and enterprise coaching designed for CEOs, SMEs, and business leaders.",
  keywords: ["Executive Education", "CEO coaching", "SME scaling", "Ultimate Success Partners", "Business Strategy Thailand"],
  authors: [{ name: "Ultimate Success Partners" }],
  metadataBase: new URL("https://www.ultimatesuccess.co"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full scroll-smooth`}>
      <body className="font-sans antialiased bg-slate-950 text-slate-100 min-h-screen flex flex-col">
        <Providers>
          <Header />
          <main className="flex-grow pt-20">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
