import "./globals.css";

export const metadata = {
  title: "AI DevOps Assistant",
  description: "Enterprise AI DevOps Assistant"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
