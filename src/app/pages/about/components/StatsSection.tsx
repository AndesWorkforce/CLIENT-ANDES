import Image from "next/image";

const stats = [
  { value: "+300", label: "Global Contractors" },
  { value: "+12", label: "Countries" },
  { value: "+15", label: "U.S.-based clients" },
];

export default function StatsSection() {
  return (
    <section className="relative w-full overflow-hidden py-24">
      {/* Background image */}
      <Image
        src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/about_us/Growing+with+results+-+Fondo.jpg"
        alt=""
        fill
        className="object-cover"
        aria-hidden
      />
      {/* Dark teal overlay */}
      <div className="absolute inset-0 bg-[rgba(4,78,92,0.7)]" />

      <div className="relative z-10 max-w-[1480px] mx-auto px-10 md:px-20 flex flex-col gap-16 items-center">
        {/* Title */}
        <h2 className="text-4xl md:text-[48px] font-bold text-white text-center leading-[1.3]">
          Growing with results
        </h2>

        {/* Stats grid */}
        <div className="flex flex-col gap-8 items-center w-full">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-[rgba(4,78,92,0.73)] border border-[#044e5c] rounded-[12px] flex flex-col items-center justify-end px-6 pb-8 pt-16"
              >
                <p className="text-[64px] font-bold text-white leading-[1.3]">
                  {stat.value}
                </p>
                <p className="text-[20px] font-semibold text-white leading-[1.3]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Description */}
          <p className="text-[20px] font-medium text-white text-center leading-[1.2] max-w-full">
            Since October 2023, Andes has grown into a global team of more than
            300 contractors across 12 countries, supporting 15 clients based in
            the United States. Our distributed model enables us to provide
            consistent, high&#8209;quality remote support while leveraging the
            exceptional professionalism, education, and talent of our
            international workforce.
          </p>
        </div>
      </div>
    </section>
  );
}
