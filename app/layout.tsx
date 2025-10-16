import type { Metadata } from 'next';
import './globals.css';
import { BaseAccountProvider } from '@/contexts/BaseAccountContext';

export const metadata: Metadata = {
  title: 'BaseBurn - Burn USDC & Earn XP',
  description: 'Burn USDC on Base Sepolia and level up!'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <BaseAccountProvider>{children}</BaseAccountProvider>
      </body>
    </html>
  );
}
