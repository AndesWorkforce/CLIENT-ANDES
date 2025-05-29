export default function ApplicantsTableSkeleton() {
  return (
    <div className="animate-pulse">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </th>
            <th className="text-left py-3 px-4">
              <div className="h-4 bg-gray-200 rounded w-28"></div>
            </th>
            <th className="text-left py-3 px-4">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </th>
            <th className="text-left py-3 px-4">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </th>
            <th className="text-left py-3 px-4">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </th>
            <th className="text-left py-3 px-4">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </th>
            <th className="text-left py-3 px-4">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(4)].map((_, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="py-4 px-4">
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </td>
              <td className="py-4 px-4">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </td>
              <td className="py-4 px-4">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-gray-200 rounded-full mr-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-gray-200 rounded-full mr-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="h-6 bg-gray-200 rounded w-24"></div>
              </td>
              <td className="py-4 px-4">
                <div className="flex space-x-2">
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ApplicantsMobileCardSkeleton() {
  return (
    <div className="border-b border-[#E2E2E2]">
      <div className="px-4 py-3">
        <div className="grid grid-cols-2 w-full">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
      <div className="px-10 pb-4 space-y-4 bg-gray-50">
        <div className="grid grid-cols-2 w-full">
          <div className="flex items-center">
            <div className="mr-2 w-4 h-4 bg-gray-200 rounded-full"></div>
            <div className="w-16 h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="w-8 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="grid grid-cols-2 w-full">
          <div className="flex items-center">
            <div className="mr-2 w-4 h-4 bg-gray-200 rounded-full"></div>
            <div className="w-16 h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="w-8 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="grid grid-cols-2 w-full">
          <div className="flex items-center">
            <div className="mr-2 w-4 h-4 bg-gray-200 rounded-full"></div>
            <div className="w-16 h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="w-32 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="grid grid-cols-2 w-full">
          <div className="flex items-center">
            <div className="mr-2 w-4 h-4 bg-gray-200 rounded-full"></div>
            <div className="w-16 h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="grid grid-cols-2 w-full">
          <div className="flex items-center">
            <div className="mr-2 w-4 h-4 bg-gray-200 rounded-full"></div>
            <div className="w-20 h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="grid grid-cols-2 w-full">
          <div className="flex items-center">
            <div className="mr-2 w-4 h-4 bg-gray-200 rounded-full"></div>
            <div className="w-20 h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-6 bg-gray-200 rounded w-20"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
