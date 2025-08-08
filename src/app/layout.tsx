import React from "react";
import "./globals.css";

export const metadata = {
  title: "Sophia Consciousness Engine",
  description: "Experimental divine-query framework"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0 }}>{children}</body>
    </html>
  );
}
