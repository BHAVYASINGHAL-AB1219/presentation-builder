import "./globals.css";

export const metadata = {
  title: "DeckAI — AI Presentation Builder",
  description:
    "Transform any prompt into a stunning presentation in seconds. Powered by AI, designed for impact.",
  keywords: ["AI", "presentation", "slides", "PowerPoint", "generator"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
