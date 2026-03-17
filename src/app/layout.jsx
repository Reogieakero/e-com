import { Unbounded, Kulim_Park } from "next/font/google";
import "./globals.css";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const kulimPark = Kulim_Park({
  variable: "--font-kulim-park",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  display: "swap",
});

export const metadata = {
  title: "Ukay Admin — E-Commerce Dashboard",
  description: "Ukay E-Commerce Administration Portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${unbounded.variable} ${kulimPark.variable}`}>
        {children}
      </body>
    </html>
  );
}
