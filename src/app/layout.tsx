import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Task Board Assessment",
  description: "Kanban-style task board built with Next.js and Supabase anonymous auth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
