export const metadata = {
  title: "Soch Song Generator",
  description: "Generate an original song featuring 'soch'",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
        background: 'linear-gradient(180deg,#0f1224 0%, #0a0c1a 100%)',
        color: '#e6e8f0',
        minHeight: '100vh',
      }}>
        {children}
      </body>
    </html>
  );
}
