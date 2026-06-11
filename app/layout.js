import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import EmpresaTracker from '../components/EmpresaTracker';

export const metadata = {
  title: 'Alumni Courses',
  description: 'Corporate English Training Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <EmpresaTracker />
        <Analytics />
      </body>
    </html>
  );
}
