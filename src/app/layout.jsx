import './index.css';

export const metadata = {
  title: 'Innerspace',
  description: 'AI-Driven Digital Design Concierge',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-brand-charcoal text-brand-bone font-sans antialiased selection:bg-brand-gold selection:text-brand-charcoal min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
