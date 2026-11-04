import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider } from '@/components/I18nProvider';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'IMỌLẸ Power Bank Sharing',
  description: 'Premium power bank sharing hardware pilot',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <ThemeProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
