"use client";

import Image from "next/image";
import QuoteBlock from "./QuoteBlock";

export default function ArticleContentSection() {
  return (
    <section className="relative w-full bg-white pt-0 pb-[11px] md:pb-[44px]">
      <div className="max-w-[850px] mx-auto px-[18px] md:px-[44px]">
        <div className="flex flex-col gap-[44px]">
          {/* First Image */}
          <div className="relative w-full h-[250px] md:h-[336px] rounded-[20px] overflow-hidden">
            <Image
              src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/05.+Blog/1.+Meet+Miguel/01+-+Miguel+fondo+gris.webp"
              alt="Article Image"
              fill
              className="object-cover"
            />
          </div>

          {/* EDUCATION & CAREER Section */}
          <div className="flex flex-col gap-[22px]">
            <p className="font-semibold text-[14px] text-[#044E5C] leading-[1.3]">
              EDUCATION & CAREER
            </p>
            <h2 className="font-semibold text-[18px] md:text-[20px] text-black leading-[1.3]">
              Numbers, the sea, and a calling that took its own shape
            </h2>
            <div className="space-y-[16px]">
              <p className="font-medium text-[16px] text-black leading-[1.2]">
                Can you walk me through your educational journey? Which schools did
                you attend, and what were your favorite subjects?
              </p>
              <p className="font-normal italic text-[14px] text-black leading-[1.5]">
                "I finished high school in Colombia, the name of my school is San
                Antonio Maria Claret, a Catholic School. I wasn't a great or terrible
                student; I was just average. It didn't take a lot of effort for me to
                pass my exams, so I was happy to get by without putting in a lot of
                effort. I always enjoyed numbers though, so my favorite subjects were
                Math and Chemistry."
              </p>

              <p className="font-medium text-[16px] text-black leading-[1.2]">
                How did you choose your career path? Were there any pivotal moments or
                influences that led you to your profession?
              </p>
              <p className="font-normal italic text-[14px] text-black leading-[1.5]">
                "I was always fascinated by the military. When I was in 8th grade, an
                older cousin joined the Colombian Air Force, and I think that had an
                impact in me. However, I was more interested in ships and sailing."
              </p>
            </div>

            {/* Two Column Layout with Image */}
            <div className="flex flex-col md:flex-row gap-[22px] mt-[22px]">
              <div className="flex-1 space-y-[16px]">
                <p className="font-medium text-[16px] text-black leading-[1.2]">
                  Can you share some of the most memorable experiences from your
                  career? Any notable achievements or challenges?
                </p>
                <p className="font-normal italic text-[14px] text-black leading-[1.5]">
                  "There was a time when I wanted to become a Navy SEAL, so I went to
                  BUD/S Training. This was a life-changing experience for me. Although I
                  didn't finish training, I had the opportunity to lead a 250-student
                  class, and that was where I learned how to lead people. I also had to
                  grow up and develop maturity to realize that it wasn't the path for
                  me."
                </p>
              </div>
              <div className="relative w-full md:w-[494px] h-[250px] md:h-[294px] rounded-[20px] overflow-hidden flex-shrink-0">
                <Image
                  src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/05.+Blog/1.+Meet+Miguel/02+-+Miguel+apreton+de+manos.webp"
                  alt="BUD/S Training"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Quote Block 1 */}
          <QuoteBlock
            text="Although I didn't finish training, I had the opportunity to lead a 250-student class, and that was where I learned how to lead people."
            author="Miguel Rendon"
          />

          {/* PERSONAL LIFE Section */}
          <div className="flex flex-col gap-[22px]">
            <p className="font-semibold text-[14px] text-[#044E5C] leading-[1.3]">
              PERSONAL LIFE
            </p>
            <h2 className="font-semibold text-[18px] md:text-[20px] text-black leading-[1.3]">
              Family, mountains, and the art of owning your time
            </h2>
            <div className="space-y-[16px]">
              <p className="font-medium text-[16px] text-black leading-[1.2]">
                Can you tell me about any significant relationships in your life, such
                as a partner, close friends, or mentors?
              </p>
              <p className="font-normal italic text-[14px] text-black leading-[1.5]">
                "My wife and my son are everything to me, I enjoy doing everything with
                them. The military kept me away from them for extended periods of time,
                so now I maximize every opportunity to share special moments with them."
              </p>

              <p className="font-medium text-[16px] text-black leading-[1.2]">
                What are some of your passions or interests outside of your
                professional life?
              </p>
              <p className="font-normal italic text-[14px] text-black leading-[1.5]">
                "Hiking! I take every opportunity to climb a mountain, explore a canyon,
                or find a waterfall somewhere."
              </p>

              <p className="font-medium text-[16px] text-black leading-[1.2]">
                How do you balance your work and personal life?
              </p>
              <p className="font-normal italic text-[14px] text-black leading-[1.5]">
                "Time management is key. I am a big planner, so I always organize my
                plans ahead of time to make sure they are evenly distributed. Once I
                have personal events on my calendar, it is easy to commit to them
                instead of rescheduling or cancelling."
              </p>
            </div>

            {/* Two Column Layout with Image (Image on Left) */}
            <div className="flex flex-col md:flex-row gap-[22px] mt-[22px]">
              <div className="relative w-full md:w-[494px] h-[250px] md:h-[294px] rounded-[20px] overflow-hidden flex-shrink-0">
                <Image
                  src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/05.+Blog/1.+Meet+Miguel/20250301_133829117_iOS+(2).webp"
                  alt="Hiking Mountains"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 space-y-[16px]">
                <p className="font-medium text-[16px] text-black leading-[1.2]">
                  How do you balance your work and personal life?
                </p>
                <p className="font-normal italic text-[14px] text-black leading-[1.5]">
                  "Time management is key. I am a big planner, so I always organize my
                  plans ahead of time to make sure they are evenly distributed. Once I
                  have personal events on my calendar, it is easy to commit to them
                  instead of rescheduling or cancelling."
                </p>
              </div>
            </div>
          </div>

          {/* REFLECTIONS & ADVICE Section */}
          <div className="flex flex-col gap-[22px]">
            <p className="font-semibold text-[14px] text-[#044E5C] leading-[1.3]">
              REFLECTIONS & ADVICE
            </p>
            <h2 className="font-semibold text-[18px] md:text-[20px] text-black leading-[1.3]">
              Purpose, planning, and living with intention
            </h2>
            <div className="space-y-[16px]">
              <p className="font-medium text-[16px] text-black leading-[1.2]">
                Looking back, what are some of the most important lessons you've
                learned in life?
              </p>
              <p className="font-normal italic text-[14px] text-black leading-[1.5]">
                "I would have taken better care of myself. I've lived a pretty healthy
                life, and I am still a pretty healthy person, but I have some issues now
                that could have been prevented."
              </p>

              <p className="font-medium text-[16px] text-black leading-[1.2]">
                Is there anything you would have done differently if given the chance?
              </p>
              <p className="font-normal italic text-[14px] text-black leading-[1.5]">
                "I would have taken better care of myself. I've lived a pretty healthy
                life, and I am still a pretty healthy person, but I have some issues now
                that could have been prevented."
              </p>

              <p className="font-medium text-[16px] text-black leading-[1.2]">
                What advice would you give to someone who is just starting out on their
                own journey?
              </p>
              <p className="font-normal italic text-[14px] text-black leading-[1.5]">
                "Live your life with a purpose. I often get complemented for the things
                I have achieved at 39, the reason for my achievements is my constant
                state of planning since I was a young adult. You should constantly be
                planning and executing a plan throughout your life. This might sound
                obvious, but I know lots of people who are just living, letting time go
                by, without any plans or purposes."
              </p>

              <p className="font-medium text-[16px] text-black leading-[1.2]">
                Where do you see yourself in five years?
              </p>
              <p className="font-normal italic text-[14px] text-black leading-[1.5]">
                "I envision expanding Andes Workforce across more countries in Latin
                America while also extending our reach to clients throughout the United
                States. Currently, our operations are limited to a few Latin American
                countries, with most of our clients based in the US east coast, over the
                next few years, my primary goal is to create more job opportunities for
                our team members while driving growth for US businesses."
              </p>

              <p className="font-medium text-[16px] text-black leading-[1.2]">
                How do you plan to use your skills and knowledge to make a positive
                impact on society?
              </p>
              <p className="font-normal italic text-[14px] text-black leading-[1.5]">
                "I believe I am already making a meaningful impact on society. Through
                our new project at Andes Workforce, we are creating real change for the
                people who work with us. Job opportunities in Latin America are often
                limited, and even for those who are employed, fair wages and job
                satisfaction can be hard to come by. We are committed to providing
                talented individuals in the region with well paying fulfilling roles in
                a positive and supportive work environment — empowering them and their
                families."
              </p>
            </div>
          </div>

          {/* Quote Block 2 */}
          <QuoteBlock
            text="Live your life with a purpose. You should constantly be planning and executing a plan throughout your life."
            author="Miguel Rendón"
          />

          {/* Final Team Image */}
          <div className="relative w-full h-[250px] md:h-[294px] rounded-[20px] overflow-hidden">
            <Image
              src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/05.+Blog/1.+Meet+Miguel/03+-+Equipo.webp"
              alt="Andes Workforce Team"
              fill
              className="object-cover"
            />
          </div>

          {/* CONCLUSION Section */}
          <div className="flex flex-col gap-[16px]">
            <p className="font-semibold text-[14px] text-[#044E5C] leading-[1.3]">
              CONCLUSION
            </p>
            <div className="space-y-[16px]">
              <p className="font-medium text-[16px] text-black leading-[1.5]">
                As we wrap up, Miguel leaves us with these words of wisdom: "Become the
                owner of your time, it is a currency that cannot be replaced." His
                journey is a testament to resilience, intentional living, and a genuine
                commitment to creating opportunity for others — and we can't wait to see
                what the future holds for him.
              </p>
              <p className="font-medium text-[16px] text-black leading-[1.5]">
                What did you find most inspiring about Miguel's story? Share your
                thoughts in the comments below! Don't forget to follow Miguel on social
                media for more updates on his journey. Stay tuned for our next interview
                where we bring you more inspiring stories from extraordinary individuals.
              </p>
            </div>
          </div>

          {/* Final Quote Block */}
          <QuoteBlock
            text="Become the owner of your time, it is a currency that cannot be replaced."
            author="Miguel Rendon"
          />
        </div>
      </div>
    </section>
  );
}
