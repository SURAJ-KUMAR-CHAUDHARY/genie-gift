import "./globals.css";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "GiftGenie AI - The Empathetic Curator",
  description: "Find the perfect gift by describing a person, emotion, and occasion.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`} data-scroll-behavior="smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-primary-container selection:text-white pb-[72px]">
        <Providers>
          <Header />
          <main className="pt-20 pb-24">
            {children}
          </main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
