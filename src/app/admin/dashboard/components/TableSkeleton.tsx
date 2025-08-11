"use client";

export default function TableSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-4">
        <div className="h-5 bg-gray-200 rounded w-48"></div>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-3 px-4">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </th>
            <th className="py-3 px-4">
              <div className="h-4 bg-gray-200 rounded w-28"></div>
            </th>
            <th className="py-3 px-4">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </th>
            <th className="py-3 px-4">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </th>
            <th className="py-3 px-4">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(7)].map((_, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-4 px-4">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </td>
              <td className="py-4 px-4">
                <div className="h-4 bg-gray-200 rounded w-40"></div>
              </td>
              <td className="py-4 px-4">
                <div className="h-4 bg-gray-200 rounded w-8"></div>
              </td>
              <td className="py-4 px-4">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MobileTableSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="p-4 border-b border-gray-200">
          <div className="space-y-3">
            <div className="h-5 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-200 rounded w-full max-w-[200px]"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-40"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
