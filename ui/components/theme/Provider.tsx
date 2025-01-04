'use client';
import { ThemeProvider } from 'next-themes';

const ThemeProviderComponent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ThemeProvider
      attribute="class"
      value={{ light: 'light', dark: 'dark', hst: 'hst' }}
      defaultTheme="light"
      enableSystem={false}
    >
      {children}
    </ThemeProvider>
  );
};

export default ThemeProviderComponent;
