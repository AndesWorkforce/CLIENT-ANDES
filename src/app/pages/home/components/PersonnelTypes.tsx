import Link from "next/link";

const S3 = "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/";

const icons = {
  legal:    `${S3}b3d671d7a9f7c7b5e3e1f8370ac01f43ac7afd57.gif`,
  data:     `${S3}evolution.gif`,
  business: `${S3}corporate-culture.gif`,
};

export default function PersonnelTypes() {
  return (
    <section className="bg-[#00224d] py-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-3">Our Services</h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Comprehensive workforce solutions tailored to your business needs
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

          {/* Card 1 — Legal & Compliance */}
          <div className="bg-white rounded-2xl p-7 flex flex-col gap-4 transition-transform duration-300 hover:scale-105 cursor-default">
            <img src={icons.legal} alt="Legal & Compliance icon" className="w-14 h-14 object-contain" />
            <h3 className="text-xl font-bold text-[#0097b2]">Legal & Compliance</h3>
            <ul className="flex flex-col gap-2">
              <li className="flex items-center gap-2 text-base text-gray-700"><span className="text-[#0097b2]">→</span>Legal assistants</li>
              <li className="flex items-center gap-2 text-base text-gray-700"><span className="text-[#0097b2]">→</span>Case managers</li>
              <li className="flex items-center gap-2 text-base text-gray-700"><span className="text-[#0097b2]">→</span>Intake specialists</li>
              <li className="flex items-center gap-2 text-base text-gray-700"><span className="text-[#0097b2]">→</span>Document processing</li>
            </ul>
          </div>

          {/* Card 2 — Data & Administration */}
          <div className="bg-white rounded-2xl p-7 flex flex-col gap-4 transition-transform duration-300 hover:scale-105 cursor-default">
            <img src={icons.data} alt="Data & Administration icon" className="w-14 h-14 object-contain" />
            <h3 className="text-xl font-bold text-[#0097b2]">Data & Administration</h3>
            <ul className="flex flex-col gap-2">
              <li className="flex items-center gap-2 text-base text-gray-700"><span className="text-[#0097b2]">→</span>Database administrators</li>
              <li className="flex items-center gap-2 text-base text-gray-700"><span className="text-[#0097b2]">→</span>Mail sorting specialists</li>
              <li className="flex items-center gap-2 text-base text-gray-700"><span className="text-[#0097b2]">→</span>Data entry and processing</li>
              <li className="flex items-center gap-2 text-base text-gray-700"><span className="text-[#0097b2]">→</span>Records management</li>
            </ul>
          </div>

          {/* Card 3 — Business Operations */}
          <div className="bg-white rounded-2xl p-7 flex flex-col gap-4 transition-transform duration-300 hover:scale-105 cursor-default">
            <img src={icons.business} alt="Business Operations icon" className="w-14 h-14 object-contain" />
            <h3 className="text-xl font-bold text-[#0097b2]">Business Operations</h3>
            <ul className="flex flex-col gap-2">
              <li className="flex items-center gap-2 text-base text-gray-700"><span className="text-[#0097b2]">→</span>Virtual assistants</li>
              <li className="flex items-center gap-2 text-base text-gray-700"><span className="text-[#0097b2]">→</span>Customer support</li>
              <li className="flex items-center gap-2 text-base text-gray-700"><span className="text-[#0097b2]">→</span>Data analysts</li>
              <li className="flex items-center gap-2 text-base text-gray-700"><span className="text-[#0097b2]">→</span>Project management</li>
            </ul>
          </div>

        </div>

        {/* Bottom CTA */}
        <div className="text-center flex flex-col items-center gap-5">
          <p className="text-white text-base leading-relaxed">
            Looking for something specific? We can find talent for any special requirement you have!
          </p>
          <Link
            href="/pages/services"
            className="inline-flex items-center bg-[#0097b2] text-white px-8 py-3 rounded-[20px] font-medium text-base transition-all hover:bg-[#007a91]"
          >
            Read More
          </Link>
        </div>
      </div>
    </section>
  );
}


