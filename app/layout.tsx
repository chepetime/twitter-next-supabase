import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Blue Bird",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="bg-slate-900 flex min-h-screen pb-30">{children}</div>
      </body>
    </html>
  );
}
