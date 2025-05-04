export default function DashboardLoading() {
  return (
    <div className="w-full h-full p-6">
      <div className="mb-6 space-y-2">
        <div className="h-8 bg-gray-200 rounded-md w-1/3 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded-md w-1/2 animate-pulse"></div>
      </div>
      
      {/* Metrics skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-5 bg-gray-200 rounded w-10"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Stats skeleton */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-4 border-b">
          <div className="h-5 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Table skeleton */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-4 border-b flex justify-between">
          <div className="h-5 bg-gray-200 rounded w-40 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center py-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-md mr-4"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="w-20 h-8 bg-gray-200 rounded-md"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
