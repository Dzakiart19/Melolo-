
import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="animate-pulse space-y-3">
      <div className="aspect-[2/3] bg-gray-800 rounded-xl"></div>
      <div className="h-4 bg-gray-800 rounded w-3/4"></div>
      <div className="h-3 bg-gray-800 rounded w-1/2"></div>
    </div>
  );
};
