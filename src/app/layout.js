import { Inter } from "next/font/google";
import "./globals.css";
import StructuredData from "./Components/StructuredData";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Rajasthan Govt Exam PYQ Quiz | Practice Previous Year Questions",
  description:
    "Practice Rajasthan Government Exam Previous Year Questions (PYQ) in quiz format. Supports MCQ, match the list, image-based questions, powerful filters by year and category, light & dark mode, and official question paper PDFs. Built by Manoj Sharma.",

  icons: {
    icon: "/og-image.png",
  },

  keywords: [
    "Rajasthan Govt Exam PYQ",
    "Rajasthan Exam Quiz",
    "RPSC Previous Year Questions",
    "Rajasthan MCQ Practice",
    "Rajasthan Competitive Exams",
    "Rajasthan Govt Jobs Preparation",
    "PYQ Quiz Rajasthan",
    "Rajasthan Exam Mock Test",
    "Rajasthan Old Question Papers",
    "MCQ Quiz App",
    "Match the Following Questions",
    "Image Based Questions",
    "Next.js Quiz App",
    "Manoj Sharma",
  ].join(", "),

  authors: [
    {
      name: "Manoj Sharma",
      url: "https://your-vercel-project-url.vercel.app/",
    },
  ],

  creator: "Manoj Sharma",

  metadataBase: new URL("https://your-vercel-project-url.vercel.app/"),

  openGraph: {
    title: "Rajasthan Govt Exam PYQ Quiz | Smart Practice Platform",
    description:
      "A modern quiz platform for Rajasthan Govt Exam PYQs. Practice MCQs, match-the-list and image-based questions with filters, answer feedback, dark mode, and official PDFs.",
    url: "https://your-vercel-project-url.vercel.app/",
    siteName: "Rajasthan Exam PYQ Quiz",
    images: [
      {
        url: "https://your-vercel-project-url.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rajasthan Govt Exam PYQ Quiz",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Rajasthan Govt Exam PYQ Quiz | Practice Smarter",
    description:
      "Prepare for Rajasthan Govt Exams with PYQs in quiz format. MCQs, match-the-list, image-based questions, filters, dark mode & PDFs.",
    creator: "@ManojSharma1822", // optional
    images: ["https://your-vercel-project-url.vercel.app/og-image.jpg"],
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
      <body className={`${inter.className} bg-white dark:bg-black`}>
        {children}
      </body>
    </html>
  );
}
