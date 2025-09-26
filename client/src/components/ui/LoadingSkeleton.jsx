import { motion } from "framer-motion";

// Skeleton component for metric cards
export function MetricSkeleton({ className = "" }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
      </div>
    </div>
  );
}

// Skeleton component for chart cards
export function ChartSkeleton({ className = "" }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
          <div className="flex gap-2">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
          </div>
        </div>
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    </div>
  );
}

// Generic skeleton component for other use cases
export function Skeleton({ className = "", width = "w-full", height = "h-4" }) {
  return (
    <div className={`bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${width} ${height} ${className}`}></div>
  );
}
