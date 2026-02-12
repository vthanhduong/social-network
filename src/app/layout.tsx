import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Montserrat } from "next/font/google";
import { Geo } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "./ReactQueryProvider";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-montserrat",
});

const geo = Geo({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-geo",
});

export const metadata: Metadata = {
  title: {
    template: "%s | phây búc",
    default: "phây búc",
  },
  description: "phây búc the mạng-xã-hội :j",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.variable} ${geo.variable}`}>
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
