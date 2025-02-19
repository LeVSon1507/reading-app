import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { LaunchDarklyProvider } from "../providers/LaunchDarklyProvider";
import Header from "components/shared/Header";
import Footer from "components/shared/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reading App",
  icons: {
    icon: "./2.svg",
  },
  description: "An application for reading and processing documents",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LaunchDarklyProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
        </LaunchDarklyProvider>
      </body>
    </html>
  );
}
