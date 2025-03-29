export function ExpandContentSkeleton() {
  return (
    <div className="px-10 pb-4 space-y-4 bg-gray-50">
      {/* Profile section */}
      <div className="grid grid-cols-2 w-full">
        <div className="flex items-center">
          <div className="mr-2 w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Video section */}
      <div className="grid grid-cols-2 w-full">
        <div className="flex items-center">
          <div className="mr-2 w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Email section */}
      <div className="grid grid-cols-2 w-full">
        <div className="flex items-center">
          <div className="mr-2 w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Phone section */}
      <div className="grid grid-cols-2 w-full">
        <div className="flex items-center">
          <div className="mr-2 w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Selection section */}
      <div className="grid grid-cols-2 w-full">
        <div className="flex items-center">
          <div className="mr-2 w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex space-x-2">
          <div className="w-12 h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-12 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
