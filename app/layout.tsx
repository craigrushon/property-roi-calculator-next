import './globals.css';

import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: 'Property ROI Calculator',
  description:
    'A simple calculator to help you estimate the return on investment for a property.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen w-full flex-col">{children}</body>
      <Analytics />
    </html>
  );
}
