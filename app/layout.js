import "./globals.css";

export const metadata = {
  title: "Tamashi",
  description: "Personal command center. Not a portfolio.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
