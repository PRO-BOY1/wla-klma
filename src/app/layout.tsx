import type { Metadata, Viewport } from "next";
import { Cairo, Tajawal } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ولا كلمة | لعبة تمثيل وتخمين",
  description: "لعبة تمثيل وتخمين جماعية بين فريقين، احترافية وجاهزة للعب من الجوال أو الكمبيوتر.",
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0B0E14",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} ${tajawal.variable} font-body antialiased no-tap-highlight`}>
        {children}
      </body>
    </html>
  );
}
