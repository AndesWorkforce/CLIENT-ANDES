"use client";

export default function StatsSection() {
  const stats = [
    {
      icon: "👥",
      value: "10M+",
      label: "Professionals in our network"
    },
    {
      icon: "📊",
      value: "95%",
      label: "Retention rate after 12 months"
    },
    {
      icon: "⚡",
      value: "60%",
      label: "Average cost savings"
    },
    {
      icon: "✅",
      value: "100%",
      label: "Compliance guaranteed"
    }
  ];

  return (
    <section 
      className="py-24 px-6"
      style={{
        backgroundImage: "linear-gradient(160.17deg, rgba(235, 248, 247, 0.9) 0%, rgba(240, 250, 249, 0.9) 50%, rgba(230, 245, 244, 0.9) 100%)"
      }}
    >
      <div className="mx-auto max-w-[1440px]">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#0c9b8e] text-[14px] font-semibold leading-[20px] tracking-[1.4px] uppercase mb-4">
            BY THE NUMBERS
          </p>
          <h2 className="text-[#0a1628] text-[32px] md:text-[48px] font-bold leading-[1.3]">
            Numbers that speak
            <br />
            for themselves
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <button
              key={index}
              className="bg-[rgba(255,255,255,0.8)] border border-[rgba(12,155,142,0.1)] rounded-[16px] p-8 flex flex-col items-center text-center transition-all hover:bg-white hover:shadow-lg"
            >
              {/* Icon */}
              <div className="bg-[rgba(12,155,142,0.12)] w-11 h-11 rounded-[16px] flex items-center justify-center mb-5">
                <span className="text-xl">{stat.icon}</span>
              </div>

              {/* Value */}
              <div className="text-[#0a1628] text-[60px] font-black leading-[60px] mb-2">
                {stat.value}
              </div>

              {/* Label */}
              <p className="text-[#5a6a7a] text-[14px] font-normal leading-[17.5px]">
                {stat.label}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
