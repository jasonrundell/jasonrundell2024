import type { ReactNode } from 'react';
import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'Kayo O Young',
  description: 'Portfolio of pottery and paintings by Kayo O Young',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>
            <Link href="/">Home</Link>
            <Link href="/pottery">Pottery</Link>
            <Link href="/paintings">Paintings</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
