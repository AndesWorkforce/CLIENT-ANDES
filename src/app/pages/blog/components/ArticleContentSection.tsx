"use client";

import Image from "next/image";

interface ArticleSection {
  type: "text" | "image" | "quote";
  content: string;
  imageUrl?: string;
  imageAlt?: string;
}

export default function ArticleContentSection() {
  const sections: ArticleSection[] = [
    {
      type: "text",
      content:
        "Contact: \"Hi Miguel! Thank you for taking the time to chat with us. To start, could you tell us what Andes Workforce is all about?\"",
    },
    {
      type: "text",
      content:
        "Miguel: \"Absolutely. Andes Workforce is a workforce solutions company that connects high-performing professionals from Latin America with businesses in the US and Canada. We focus on placing skilled individuals in roles like legal support, project management, and technology—areas where we've seen incredible talent across the region.\"",
    },
    {
      type: "text",
      content:
        "Contact: \"That's fascinating. What made you decide to start Andes Workforce?\"",
    },
    {
      type: "text",
      content:
        "Miguel: \"The idea came from my own experiences working with companies that relied on remote teams. I saw firsthand how skilled professionals in Latin America were often undervalued or overlooked, while businesses struggled to find cost-effective yet high-quality talent. It felt like there was a real gap we could bridge.\"",
    },
    {
      type: "image",
      imageUrl: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/blog/team-photo.jpg",
      imageAlt: "Andes Workforce Team",
      content: "",
    },
    {
      type: "text",
      content:
        "Contact: \"And what has been the most rewarding part of building Andes Workforce?\"",
    },
    {
      type: "text",
      content:
        "Miguel: \"Honestly, it's the people. Every time I hear about someone we've placed who's thriving in their new role—or a business that's scaled thanks to the team we've built for them—it reminds me why we do this. We're not just filling positions; we're creating opportunities that transform lives.\"",
    },
    {
      type: "quote",
      content:
        "\"I can see life after, I can see you're not dreaming anymore after this war.\"",
    },
    {
      type: "text",
      content:
        "Contact: \"That's incredibly inspiring. What sets Andes Workforce apart from other staffing companies?\"",
    },
    {
      type: "text",
      content:
        "Miguel: \"A few things. First, we're selective. Every professional we place goes through a rigorous vetting process—we look at skills, adaptability, and cultural fit. Second, we focus on long-term partnerships. We're not here to just make a placement and move on; we stay involved to make sure both the client and the professional succeed. Finally, we're deeply invested in the success of Latin America. Our mission is to showcase the region's talent on a global stage.\"",
    },
    {
      type: "text",
      content:
        "Contact: \"You mentioned the importance of cultural fit. How do you ensure that in your placements?\"",
    },
    {
      type: "text",
      content:
        "Miguel: \"It starts with understanding our clients' needs on a deeper level—not just the job description, but their company culture, values, and goals. Then, we match them with professionals who align with that vision. We also provide training and onboarding support to make the transition as smooth as possible.\"",
    },
    {
      type: "text",
      content:
        "Contact: \"What advice would you give to someone considering a career with Andes Workforce or hiring through your platform?\"",
    },
    {
      type: "text",
      content:
        "Miguel: \"For professionals, I'd say: take the leap. Working with international companies can open doors you never imagined. And for businesses, I'd encourage you to think long-term. Building a great team takes time, but it's one of the best investments you can make.\"",
    },
    {
      type: "image",
      imageUrl: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/blog/team-group.jpg",
      imageAlt: "Team collaboration",
      content: "",
    },
    {
      type: "text",
      content:
        "Contact: \"Looking ahead, what's next for Andes Workforce?\"",
    },
    {
      type: "text",
      content:
        "Miguel: \"We're expanding. Right now, we're working on building deeper partnerships in new industries and exploring ways to support the professional development of the talent we place. Our goal is to be the go-to partner for businesses looking to scale with world-class teams.\"",
    },
    {
      type: "quote",
      content:
        "\"I can see life after, I can see you're not dreaming anymore after this war.\"",
    },
    {
      type: "text",
      content:
        "Contact: \"That sounds exciting. Finally, what would you say is the most important lesson you've learned so far?\"",
    },
    {
      type: "text",
      content:
        "Miguel: \"Trust the process. Building something meaningful takes time, and there will be challenges along the way. But if you stay committed to your mission and the people you're serving, the results will follow.\"",
    },
    {
      type: "text",
      content:
        "Contact: \"Miguel, thank you so much for sharing your story. It's clear that Andes Workforce is making a real difference.\"",
    },
    {
      type: "text",
      content:
        "Miguel: \"Thank you. It's been a pleasure talking with you.\"",
    },
  ];

  return (
    <section className="relative w-full bg-white py-[44px] md:py-[66px]">
      <div className="max-w-[900px] mx-auto px-[18px] md:px-[44px]">
        {sections.map((section, index) => {
          if (section.type === "text") {
            return (
              <p
                key={index}
                className="font-normal text-[16px] md:text-[18px] leading-[1.6] text-[#343434] mb-[24px]"
              >
                {section.content}
              </p>
            );
          }

          if (section.type === "image" && section.imageUrl) {
            return (
              <div
                key={index}
                className="relative w-full h-[300px] md:h-[400px] rounded-[24px] overflow-hidden mb-[44px]"
              >
                <Image
                  src={section.imageUrl}
                  alt={section.imageAlt || "Article image"}
                  fill
                  className="object-cover"
                />
              </div>
            );
          }

          if (section.type === "quote") {
            return (
              <blockquote
                key={index}
                className="border-l-[4px] border-[#0097B2] pl-[24px] my-[44px] italic"
              >
                <p className="font-semibold text-[20px] md:text-[24px] leading-[1.4] text-[#343434]">
                  {section.content}
                </p>
              </blockquote>
            );
          }

          return null;
        })}
      </div>
    </section>
  );
}
