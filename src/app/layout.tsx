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
  metadataBase: new URL("https://andes-workforce.com"),
  title: {
    default: "Andes Workforce | Human Resources Management Platform",
    template: "%s | Andes Workforce",
  },
  description:
    "Comprehensive platform for human resources management, recruitment, and talent selection. Find jobs and connect with the best talents at Andes Workforce.",
  keywords: [
    "human resources",
    "job",
    "employment",
    "recruitment",
    "selection",
    "talent",
    "hiring",
    "staff",
    "candidates",
    "hr management",
    "applications",
    "job offers",
    "andes workforce",
    "recursos humanos",
    "empleo",
    "trabajo",
    "reclutamiento",
    "selección",
    "contratación",
    "personal",
    "postulaciones",
  ],
  authors: [{ name: "Andes Workforce" }],
  creator: "Andes Workforce",
  publisher: "Andes Workforce",
  manifest: "/manifest.json",
  applicationName: "Andes Workforce",
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "https://andesworkforce.com/en",
      "es-ES": "https://andesworkforce.com/es",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://andesworkforce.com/",
    siteName: "Andes Workforce",
    title: "Andes Workforce | Human Resources Management Platform",
    description:
      "Comprehensive platform for human resources management, recruitment, and talent selection.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Andes Workforce Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Andes Workforce | HR Management",
    description:
      "Comprehensive platform for human resources management and recruitment.",
    creator: "@andesworkforce",
    images: ["/logo.png"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
    other: {
      rel: "icon",
      url: "/logo.png",
    },
  },
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
