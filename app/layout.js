import './globals.css';

export const metadata = {
  title: 'MCubed BI — Dashboard',
  description: 'DDI Analytics Business Intelligence Dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50">
        {children}
      </body>
    </html>
  );
}
