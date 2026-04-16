import './globals.css';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: 'Alumni Courses',
  description: 'Corporate English Training Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
