import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Routinelle",
  description: "A neutral skincare routine foundation for Routinelle.",
  other: {
    "color-scheme": "light",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {/*
          Forced to light: every custom component in this app uses hardcoded
          light-mode hex colors (no `dark:` variants exist anywhere), but
          `enableSystem` still auto-applied the unused starter-template dark
          CSS variables whenever a user's OS was in dark mode -- making any
          text relying on the inherited --foreground color (near-white in
          .dark) invisible against those hardcoded light backgrounds.
        */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          {children}
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
