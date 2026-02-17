"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { getHolidaysByCountry, type Holiday } from "../admin/superAdmin/settings/actions/holidays.actions";
import { HOLIDAY_MULTIPLIERS, getHolidayCompensationMessage } from "@/data/holidayCompensation";

export default function BonificationsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHolidays = async () => {
      if (!isAuthenticated || !user?.pais) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getHolidaysByCountry(user.pais);
        if (response.success && response.data?.data) {
          setHolidays(response.data.data);
        } else {
          setHolidays([]);
        }
      } catch (error) {
        console.error("Error loading holidays:", error);
        setHolidays([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadHolidays();
  }, [isAuthenticated, user?.pais]);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-[#08252A] mb-6">
        Incentives & Holidays
      </h1>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-[#1f497d] text-white">
              <th className="px-4 py-3 text-left font-semibold">Bonus</th>
              <th className="px-4 py-3 text-left font-semibold">Description</th>
              <th className="px-4 py-3 text-left font-semibold">
                Eligibility Criteria
              </th>
              <th className="px-4 py-3 text-left font-semibold">
                Estimated Amount or Percentage
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-4 py-3 font-medium">Referral</td>
              <td className="px-4 py-3">
                Bonus awarded to a contractor who successfully refers another
                contractor.
              </td>
              <td className="px-4 py-3">
                The referred contractor must remain with the company for at
                least 90 days.
              </td>
              <td className="px-4 py-3">$100</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">Individual Performance</td>
              <td className="px-4 py-3">
                Bonus awarded to a contractor for achieving individual or team
                goals, as contractually agreed. Paid in June and December.
              </td>
              <td className="px-4 py-3">
                Achievement of goals or results agreed upon with the company.
              </td>
              <td className="px-4 py-3">
                5% of the monthly payment, accumulated semiannually (e.g., for
                $1,000 → $50)
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">Discretionary Bonus</td>
              <td className="px-4 py-3">
                Bonus awarded at the company’s discretion as an annual
                incentive.
              </td>
              <td className="px-4 py-3">All contractors.</td>
              <td className="px-4 py-3">
                Equivalent to half or a full month’s payment, pro-rated based on
                length of service.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">Seniority</td>
              <td className="px-4 py-3">
                Bonus awarded as recognition for years of service with the
                company. Paid monthly.
              </td>
              <td className="px-4 py-3">
                Length of service (e.g., 2, 3 years).
              </td>
              <td className="px-4 py-3">
                25% of one month’s payment, divided into 12 installments (e.g.,
                for $1,000 → $250 annually).
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">Recognition</td>
              <td className="px-4 py-3">
                Bonus for exceptional achievements, innovation, or leadership in
                assigned projects.
              </td>
              <td className="px-4 py-3">
                Awarded at the company’s discretion.
              </td>
              <td className="px-4 py-3">
                Estimated value according to internal policy.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">Non-Monetary Benefits</td>
              <td className="px-4 py-3">
                Complementary benefits awarded at the company’s discretion
                (e.g., travel allowances, gifts, awards, experiences).
              </td>
              <td className="px-4 py-3">
                Awarded at the company’s discretion.
              </td>
              <td className="px-4 py-3">
                Estimated value according to internal policy.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Note: This page is for informational purposes for contractors.
      </p>

      {/* Holidays Section */}
      <div className="mt-8">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#0097B2] border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Loading holidays...</p>
          </div>
        ) : !isAuthenticated ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-[#08252A] mb-2">
              Login to see holidays
            </h3>
            <p className="text-gray-600">
              Please log in to see the public holidays for your country.
            </p>
          </div>
        ) : !user?.pais ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-[#08252A] mb-2">
              Complete your profile
            </h3>
            <p className="text-gray-600">
              Please update your country information in your profile to see
              relevant holidays.
            </p>
          </div>
        ) : holidays.length > 0 ? (
          <div className="max-w-2xl mx-auto">
            <div className="overflow-hidden rounded-lg border border-gray-300 bg-white">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#0097B2]">
                    <th 
                      colSpan={2} 
                      className="px-6 py-4 text-center text-2xl font-bold text-black"
                    >
                      {user.pais} - Public Holidays {new Date().getFullYear()}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {holidays.map((holiday) => (
                    <tr key={holiday.id}>
                      <td className="px-6 py-1.5 text-center font-medium text-base w-1/3">
                        {new Date(new Date().getFullYear(), holiday.mes - 1, holiday.dia).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-1.5 text-center text-base w-2/3">
                        {holiday.nombre}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Compensation Description */}
            {HOLIDAY_MULTIPLIERS[user.pais] && (
              <div className="mt-6 p-6 bg-white rounded-lg">
                <p className="text-center text-sm text-gray-700 leading-relaxed">
                  {getHolidayCompensationMessage(user.pais)}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-[#08252A] mb-2">
              Holidays not available
            </h3>
            <p className="text-gray-600">
              Holiday information for {user?.pais} is not available yet.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
