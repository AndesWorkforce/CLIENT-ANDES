export default function AboutContent() {
  return (
    <section className="w-full bg-white py-16">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0097B2] mb-6">
          Andes Workforce
        </h2>

        <p className="text-base md:text-lg text-gray-800 leading-relaxed mb-6">
          At Andes Workforce, we connect U.S. businesses with skilled,
          professional contractors across Latin America. Our mission is to
          deliver exceptional talent while improving the lives of our team
          members through stable income and personal growth. We care deeply
          about people, not just as professionals, but as individuals. By
          building strong, supportive teams, we ensure outstanding service and
          long-term success for both our clients and our workforce. Our team
          members bring the administrative and customer service skills you are
          looking for, skills that will help you expand your business while
          growing your client base.
        </p>

        <blockquote className="text-lg md:text-xl text-gray-700 italic border-l-4 border-[#0097B2] pl-4 my-8">
          &quot;Become the owner of your time, it is a currency that cannot be
          replaced&quot; Miguel Rendon
        </blockquote>

        {/* Contact info */}
        <div className="flex flex-col gap-4 mt-8">
          <div className="flex items-center">
            <div className="bg-[#0097B2] rounded-full p-2 mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-gray-800 text-base md:text-lg">
              info@andes-workforce.com
            </span>
          </div>
          <div className="flex items-center">
            <div className="bg-[#0097B2] rounded-full p-2 mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <span className="text-gray-800 text-base md:text-lg">
              +1 7572373612 - +1 3057030023
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
