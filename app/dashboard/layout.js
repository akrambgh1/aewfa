import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import { DashboardAuthProvider } from "@/context/dashboard/AuthContext";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

// Keeps this route out of search engines and link previews.
// This is a courtesy layer only — the real protection is Firebase Auth
// + Firestore rules (see the README). Do not rely on noindex alone.
export const metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false, nocache: true },
};

export default function DashboardLayout({ children }) {
  return (
    <div className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} font-body`}>
      <DashboardAuthProvider>{children}</DashboardAuthProvider>
    </div>
  );
}
