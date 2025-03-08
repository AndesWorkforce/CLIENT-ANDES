import Link from "next/link";

export default function AboutSection() {
  return (
    <section className="py-16 bg-[#FCFEFF]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">About Us</h2>
          <p className="text-gray-600 text-lg">
            We are a platform dedicated to connecting talented professionals
            with great opportunities. Our mission is to help businesses grow and
            individuals thrive in their careers.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/auth/register"
            className="inline-block bg-[#0097B2] text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-[#007A8F] transition-colors"
          >
            Read More
          </Link>
        </div>
      </div>
    </section>
  );
}
