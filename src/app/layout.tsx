import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toast } from "@/components/ui/Toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "react-quill/dist/quill.snow.css";
import "quill/dist/quill.snow.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Andes Workforce",
  description: "Plataforma de gestión de recursos humanos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
        <Footer />
        <Toast />
      </body>
    </html>
  );
}
