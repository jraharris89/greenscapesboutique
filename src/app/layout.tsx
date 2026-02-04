import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "@/styles/globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Greenscapes Boutique | Boise's Premier Plant Shop",
    template: "%s | Greenscapes Boutique",
  },
  description:
    "Discover rare tropical plants, succulents, and unique planters at Greenscapes Boutique in Boise, Idaho. Your green oasis of inspiration awaits.",
  keywords: [
    "plant shop",
    "Boise plants",
    "tropical plants",
    "succulents",
    "houseplants",
    "rare plants",
    "plant boutique",
    "Idaho plant store",
    "indoor plants",
    "planters",
  ],
  authors: [{ name: "Greenscapes Boutique" }],
  creator: "Greenscapes Boutique",
  publisher: "Greenscapes Boutique",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://greenscapesboutique.com",
    siteName: "Greenscapes Boutique",
    title: "Greenscapes Boutique | Boise's Premier Plant Shop",
    description:
      "Discover rare tropical plants, succulents, and unique planters at Greenscapes Boutique in Boise, Idaho.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Greenscapes Boutique - Beautiful plants for your home",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Greenscapes Boutique | Boise's Premier Plant Shop",
    description:
      "Discover rare tropical plants, succulents, and unique planters at Greenscapes Boutique in Boise, Idaho.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', 'YOUR_META_PIXEL_ID');
              fbq('track', 'PageView');
            `,
          }}
        />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','YOUR_GTM_ID');
            `,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col font-sans">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=YOUR_GTM_ID"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
