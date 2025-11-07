import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LJDND - D&D Chat & Dice Roller',
  description: 'Real-time chat and dice rolling for D&D sessions',
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
