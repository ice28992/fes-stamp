import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";
import Header from '@/components/base/Header';
import Footer from '@/components/base/Footer';
import "./globals.css";

const MPlus = M_PLUS_Rounded_1c({
  subsets: ['latin'],
  weight: ['100','300','400','500','700','800','900'],
});

export const metadata: Metadata = {
  title: "文化祭スタンプラリー",
  description: "スタンプラリー",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${MPlus.className} antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
