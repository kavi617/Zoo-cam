import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "./toast";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zoo Live Cam Monitor",
  description: "San Diego Zoo — Live Monitor Wall",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${inter.variable} antialiased font-sans`}
        suppressHydrationWarning
      >
        <ToastProvider>{children}</ToastProvider>
        {/* Statcounter Code Start */}
        <script
          dangerouslySetInnerHTML={{
            __html: `var sc_project=13213842; var sc_invisible=1; var sc_security=\"affb61dc\";`,
          }}
        />
        <script
          src="https://www.statcounter.com/counter/counter.js"
          async
        />
        <noscript>
          <div className="statcounter">
            <a
              title="free hit counter"
              href="https://statcounter.com/"
              target="_blank"
            >
              <img
                className="statcounter"
                src="https://c.statcounter.com/13213842/0/affb61dc/1/"
                alt="free hit counter"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </a>
          </div>
        </noscript>
        <a href="https://statcounter.com/p13213842/?guest=1">View My Stats</a>
        {/* Statcounter Code End */}
      </body>
    </html>
  );
}
