export default function BonificationsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-[#08252A] mb-6">
        Table of Additional Incentives for Contractors
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
    </main>
  );
}
