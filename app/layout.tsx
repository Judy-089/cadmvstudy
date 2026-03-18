import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@/components/AuthProvider";
import { GuestGuard } from "@/components/GuestGuard";

export const metadata: Metadata = {
  title: "AceDriveGo - Ace Your California DMV Test",
  description:
    "Bilingual CA DMV driver's license study platform. Ace your California DMV test with bilingual content and realistic mock exams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;700&family=Noto+Sans+TC:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-bg antialiased">
        <AuthProvider>
          <Navbar />
          <GuestGuard />
          <main className="pb-20 md:pb-0">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
