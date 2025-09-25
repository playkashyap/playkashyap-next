import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/themeProvider";
import { SplashGate } from "@/components/shell/SplashGate";
import { DockPortal } from "@/components/shell/DockPortal";
import { Loader } from "@/components/Loader/loader";
import MacTopBar from "@/components/topbar/topbar";
import MacWindow from "@/components/macWindow/macWindow";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "playkashyap",
  description:
    "Personal portfolio of Shubham Kumar Prajapari, fullstack developer. copyright 2025.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider defaultMode="system" defaultAccent="violet">
          <SplashGate durationMs={4500} Loader={Loader}>
            <MacTopBar />
            <MacWindow>{children}</MacWindow>
            <DockPortal />
          </SplashGate>
        </ThemeProvider>
      </body>
    </html>
  );
}
