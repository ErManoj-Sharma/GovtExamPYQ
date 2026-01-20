// components/StructuredData.tsx
"use client";

import React from "react";

const StructuredData = () => {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Manoj Sharma",
    url: "https://mysite-mu-jet.vercel.app", // Replace with your actual domain
    sameAs: [
      "https://github.com/ErManoj-Sharma",        // GitHub
      "https://www.linkedin.com/in/ermanojsharma/",   // LinkedIn
      "https://x.com/ManojSharma1822"  // Twitter or X
    ],
    jobTitle: "Full Stack Developer",
    description:
      "Full stack developer sharing blogs, cheat sheets, and courses on Python, Java, SQL, Docker, Redux, Vim, Linux, and more.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export default StructuredData;
