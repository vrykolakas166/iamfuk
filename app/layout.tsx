import "./globals.css";
import { DM_Sans } from "next/font/google";
import HeaderAuth from "@/components/header-auth";
import { HeaderContainer } from "@/components/header-container";
import { ThemeProvider } from "next-themes";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { RainEffect } from "@/components/effects/RainEffect";
import { WeatherWidget } from "@/components/ui/weather-widget";
import Link from "next/link";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "iamfuk",
  description: "Phuc Pham Hong's portfolio website",
};

const dmsans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const response = await fetch(`${defaultUrl}/api/get-weather`);
  if (!response.ok) throw new Error("Failed to fetch weather data");
  const weatherData = await response.json();

  return (
    <html lang="en" className={dmsans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <RainEffect weather={weatherData} />
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col items-center">
              <HeaderContainer classNameParam="sticky z-50 sm:top-5 sm:px-6">
                <nav className="w-full max-w-7xl flex justify-center border border-foreground/10 h-16 backdrop-blur-md sm:rounded-2xl">
                  <div className="w-full py-3 px-5 flex justify-between items-center text-sm">
                    <div className="flex gap-5 items-center font-semibold">
                      <Link
                        href={"/"}
                        className="text-2xl hover:scale-105 transition-all"
                      >
                        iamfuk.
                      </Link>
                    </div>
                    <HeaderAuth />
                  </div>
                </nav>
              </HeaderContainer>
              <div className="min-h-screen flex flex-col gap-20 max-w-7xl p-5">
                {children}
              </div>

              <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
                <p>
                  Developed by{" "}
                  <a
                    href="https://www.instagram.com/vrykolakas16/"
                    target="_blank"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                  >
                    Me
                  </a>
                </p>
                <WeatherWidget
                  classNameParam={`fixed left-4 bottom-4`}
                  weather={weatherData}
                />
                <ThemeSwitcher />
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}