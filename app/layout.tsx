import type { Metadata } from "next";
import { Montserrat, Cormorant_Garamond } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "./providers";
import Cursor from "@/components/Cursor";
import "./globals.css";

import { i } from "framer-motion/client";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "RAYEN PROMOTION",
  description: "PROMOTION de luxe en Algérie",
  appleWebApp: {
    title: "RAYEN PROMOTION",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className={`${montserrat.variable} ${cormorant.variable}`}
      >
        
        <Navbar />
        <Providers>{children}</Providers>
        <Footer />
      </body>
    </html>
  );
}
