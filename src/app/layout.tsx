import Navbar from '@/components/navbar/Navbar';
import "./globals.css";
import "./tablet.css";
import type { Metadata } from 'next'
import getCurrentUser from './action/getCurrentUser';
import LoginModal from '@/components/modal/LoginModal';
import RegisterModal from '@/components/modal/RegisterModal';
import ClientOnly from '@/components/ClientOnly';
import ToasterProvider from '@/providers/ToasterProvider';
import { Noto_Sans_KR } from "next/font/google";
import dynamic from "next/dynamic";

const inter = Noto_Sans_KR({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "애즈원 예약시스템",
  description: "ASONE 회의실 예약시스템",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser();

  return (
    <html>
      <head>
        <meta name="mobile-web-app-capable" content="yes"></meta>
        <meta name="theme-color" content="#0E1628" />
        <link rel="manifest" href="/manifest.json" />        
        <link rel="apple-touch-icon" href="/icon-192x192.png"></link>
        <link
          rel="icon"
          href="favicon-16x16.png"
          type="image/png"
          sizes="16x16"
        />
        <link
          rel="icon"
          href="favicon-32x32.png"
          type="image/png"
          sizes="32x32"
        />
      </head>
      <body className={inter.className}>
        <ClientOnly>
          <ToasterProvider />
          <LoginModal />
          <RegisterModal />
          <Navbar currentUser={currentUser} />
        </ClientOnly>
        <main className="max-w-7xl m-auto min-h-full">{children}</main>
      </body>
    </html>
  );
}
