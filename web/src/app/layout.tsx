import type { Metadata } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/montserrat";
import "@fontsource/caveat/500.css";
import "@fontsource/oswald/500.css";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: { default: "Lost Voices of Fentanyl", template: "%s · Lost Voices of Fentanyl" },
  description:
    "Lost Voices of Fentanyl is a 501(c)(3) of bereaved families devoted to public awareness, education and prevention of illicit fentanyl poisonings.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
