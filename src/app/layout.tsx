import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: {
    default: "Banco de Sangre — Sistema de Gestión",
    template: "%s | Banco de Sangre",
  },
  description:
    "Sistema integral de gestión de donantes, donaciones e inventario de sangre. Plataforma segura bajo estándares OWASP.",
  openGraph: {
    type: "website",
    siteName: "Banco de Sangre",
    title: "Banco de Sangre — Sistema de Gestión",
    description:
      "Sistema integral de gestión de donantes, donaciones e inventario de sangre. Plataforma segura bajo estándares OWASP.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Banco de Sangre — Sistema de Gestión",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Banco de Sangre — Sistema de Gestión",
    description:
      "Sistema integral de gestión de donantes, donaciones e inventario de sangre. Plataforma segura bajo estándares OWASP.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
