
//imports
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from 'next/dynamic';

// Optimized font loading with fallbacks
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  fallback: ['system-ui', 'sans-serif']
});

// Dynamic import for the wrapper to reduce initial load
const DashboardWrapper = dynamic(
  () => import('./dashboardWrapper'),
  {
    ssr: false,
    loading: () => <div>Loading...</div>
  }
);

// For demonstration, hardcode 'en' or use Next.js i18n routing
const locale = 'en';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={locale} dir="ltr" suppressHydrationWarning>
      <body className={`${inter.className} bg-background antialiased`}>
        <DashboardWrapper>
          {children}
        </DashboardWrapper>
      </body>
    </html>
  );
}