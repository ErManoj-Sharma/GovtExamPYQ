import { Inter } from "next/font/google";
import "./globals.css";
import StructuredData from "./Components/StructuredData";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Manoj Sharma | Full Stack Developer Portfolio, Blogs & Courses",
  description:
    "Explore Manoj Sharma's personal portfolio featuring expert blogs on programming and full stack development. Access free courses on Python, Java, Advent of Code, SQL, and cheat sheets for Docker, Redux, Next.js, Linux, and more. Get in touch or learn about the latest tech skills.",
  icons: {
    icon: "/og-image.png", // or "/your-icon.png"
  },
  keywords: [
    "Manoj Sharma",
    "Full Stack Developer",
    "Programming Blogs",
    "Free Coding Courses",
    "Python Course",
    "Java Course",
    "SQL Course",
    "Advent of Code",
    "Docker Cheat Sheet",
    "Redux Cheat Sheet",
    "Next.js SEO",
    "Linux Tips",
    "Vim Commands",
    "Web Development Portfolio",
    "React Developer",
    "Contact Manoj Sharma",
    "Frontend Backend Skills",
    "JavaScript Developer",
    "Software Developer Portfolio",
  ].join(", "),
  authors: [{ name: "Manoj Sharma", url: "https://manoj-sharma-portfolio.vercel.app/" }],
  creator: "Manoj Sharma",
  metadataBase: new URL("https://manoj-sharma-portfolio.vercel.app/"),
  openGraph: {
    title: "Manoj Sharma | Full Stack Developer Portfolio & Learning Hub",
    description:
      "Visit my portfolio to read blogs on full stack development, access coding courses, and download powerful developer cheat sheets.",
    url: "https://manoj-sharma-portfolio.vercel.app/",
    siteName: "Manoj Sharma Portfolio",
    images: [
      {
        url: "https://manoj-sharma-portfolio.vercel.app/og-image.jpg", // Replace with your Open Graph image
        width: 1200,
        height: 630,
        alt: "Manoj Sharma Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manoj Sharma | Developer Portfolio, Blogs & Courses",
    description:
      "Access free coding content including full stack dev blogs, Python/Java/SQL courses, Docker/Redux cheat sheets, and more.",
    creator: "@ManojSharma1822", // Optional
    images: ["https://manoj-sharma-portfolio.vercel.app/og-image.jpg"], // Replace with actual image
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      maxSnippet: -1,
      maxImagePreview: "large",
      maxVideoPreview: -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const savedTheme = localStorage.getItem('darkMode');
                if (savedTheme === 'true') {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-white dark:bg-black`}>{children}</body>
    </html>
  );
}
