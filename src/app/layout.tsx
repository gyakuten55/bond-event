import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DemoBanner } from "@/components/layout/demo-banner";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BOND | チャリティービジネス交流会",
    template: "%s | BOND",
  },
  description:
    "WE ARE NOT ALONE - 関西発のチャリティービジネス交流会BOND。交流して情報交換や人脈作りをして仕事に役立て、参加費は全額支援団体に寄付します。",
  keywords: ["BOND", "交流会", "チャリティー", "ビジネス", "関西", "大阪", "ネットワーキング"],
  openGraph: {
    title: "BOND | チャリティービジネス交流会",
    description: "WE ARE NOT ALONE - 関西発のチャリティービジネス交流会",
    url: "https://cross-bond.jp",
    siteName: "BOND",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} font-sans antialiased bg-background text-text-primary`}>
        <DemoBanner />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
