"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

interface Country {
  name: { common: string };
  flags: { png: string };
  cca3: string;
}

export default function ContactFormSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
  });
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca3,flags"
        );
        if (!response.ok) throw new Error("Error fetching countries");
        const data = await response.json();
        const sorted = data.sort((a: Country, b: Country) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sorted);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    console.log("Form submitted:", formData);
  };

  return (
    <section
      id="contact-form"
      className="relative w-full h-screen flex items-center"
    >
      {/* Left side - Image with gradient overlay */}
      <div className="relative w-1/2 h-full">
        <Image
          src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/contactus_offers.jpg"
          alt="Office workspace"
          fill
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(0,151,178,0) 50%, #0097b2 100%)",
          }}
        />
      </div>

      {/* Right side - Form */}
      <div
        className="w-1/2 h-full flex items-center justify-center px-16"
        style={{
          background:
            "linear-gradient(90.31deg, rgb(0, 151, 178) 5.218%, rgb(0, 100, 118) 99.736%)",
        }}
      >
        <div className="w-full max-w-xl space-y-8">
          {/* Header */}
          <div className="text-white space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold">Contact Us</h2>
            <p className="text-sm">
              Fill out the form for a consultation. Our Andes Workforce team typically
              reaches out<br />within 24 hours.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-white text-base font-medium block">Full Name</label>
              <input
                type="text"
                placeholder="Ex: Alexander Hamilton"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#0097b2]"
                required
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-white text-base font-medium block">Email Address</label>
              <input
                type="email"
                placeholder="Ex: alexander@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#0097b2]"
                required
              />
            </div>

            {/* Country and Phone Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Country Select */}
              <div className="space-y-2">
                <label className="text-white text-base font-medium block">Country</label>
                <div className="relative">
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#0097b2] cursor-pointer"
                    required
                    disabled={loadingCountries}
                  >
                    <option value="">Select option here...</option>
                    {countries.map((country) => (
                      <option key={country.cca3} value={country.name.common}>
                        {country.name.common}
                      </option>
                    ))}
                  </select>
                  {loadingCountries ? (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="animate-spin h-4 w-4 border-2 border-[#0097b2] border-t-transparent rounded-full" />
                    </div>
                  ) : (
                    <ChevronDown
                      size={16}
                      className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                    />
                  )}
                </div>
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label className="text-white text-base font-medium block">Phone (Optional)</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#0097b2]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#FFFFFF] hover:bg-[#FFFFFF] text-[#0097b2] px-8 py-3 rounded-2xl font-medium transition-colors cursor-pointer"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
