import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toast } from "@/components/ui/Toast";
import { AuthValidator } from "@/components/AuthValidator";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "react-quill/dist/quill.snow.css";
import "quill/dist/quill.snow.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://andesworkforce.com"),
  title: {
    default: "Andes Workforce | Human Resources Management Platform",
    template: "%s | Andes Workforce",
  },
  description:
    "Andes Workforce is a veteran-owned talent solutions company connecting businesses with skilled professionals across Latin America. We specialize in remote staffing, recruitment, and workforce management—helping organizations scale efficiently while empowering regional talent. Connecting Talent. Empowering Growth.",
  keywords: [
    // Core
    "andes workforce",
    "human resources",
    "human resources management platform",
    "hr management",
    "online hr management",
    "hr solutions",
    "hr applications",
    "hr resources",
    // Services & positioning
    "paralegal services provider",
    "virtual assistant",
    "business process outsourcing",
    "outsourcing services",
    "employment agency",
    "staffing",
    "workforce",
    "veteran-owned outsourcing",
    "legal research service",
    // Geography & talent
    "va latam",
    "latam talent",
    // Hiring & speed
    "fast hiring",
    // Jobs & categories
    "bpo jobs",
    "offshore jobs",
    // Spanish variants
    "recursos humanos",
    "gestión de recursos humanos",
    "plataforma de recursos humanos",
    "outsourcing",
    "agencia de empleo",
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
      "Andes Workforce connects businesses with skilled LATAM professionals through remote staffing, recruitment, and workforce management.",
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
      "Talent solutions across LATAM: remote staffing, recruitment, and workforce management.",
    creator: "@andesworkforce",
    images: ["/logo.png"],
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
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-11VQNRYDS8"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);} 
            gtag('js', new Date());
            gtag('config', 'G-11VQNRYDS8');
          `}
        </Script>

        {/* Google tag (gtag.js) event - delayed navigation helper */}
        <Script id="gtag-conversion-helper" strategy="afterInteractive">
          {`
            function gtagSendEvent(url) {
              var callback = function () {
                if (typeof url === 'string') {
                  window.location = url;
                }
              };
              gtag('event', 'ads_conversion_Contact_1', {
                'event_callback': callback,
                'event_timeout': 2000,
              });
              return false;
            }
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <AuthValidator />
        <Navbar />
        {children}
        <Footer />
        <Toast />
      </body>
      <Script src="/appwise-banner.js" />
    </html>
  );
}
