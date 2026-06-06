import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sarabun",
});

export const metadata: Metadata = {
  title: "ฐานข้อมูลกลางเมืองตาคลี",
  description: "ระบบฐานข้อมูลกลางของเทศบาลเมืองตาคลี จังหวัดนครสวรรค์",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" data-theme="takhli">
      <body className={sarabun.className}>{children}</body>
    </html>
  );
}
