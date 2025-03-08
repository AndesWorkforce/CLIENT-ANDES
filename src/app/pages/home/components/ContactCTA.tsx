import Link from "next/link";

export default function ContactCTA() {
  return (
    <section className="py-12 bg-[#E2E2E2] ">
      <div className="container mx-auto px-4 ">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-lg text-gray-700 mb-8">
            We handle regulatory requirements, ensuring compliant hiring for all
            parties involved. Would you like to hear more about our services?
            Please contact us.
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-[#0097B2] hover:bg-[#00778E] text-white font-medium py-3 px-8 rounded-md transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
