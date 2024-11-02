import React, { useEffect, useState } from 'react';

const PartitionGif = () => {
  const [phase, setPhase] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(p => (p + 1) % 28);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Predefined states showing partition around middle element
  const states = [
    // Initial array with pivot highlighted
    [8, 3, 6, 5, 2, 9, 1, 4],
    // Moving pointers
    [8, 3, 6, 5, 2, 9, 1, 4],
    [8, 3, 6, 5, 2, 9, 1, 4],
    // First swap
    [8, 3, 4, 5, 2, 9, 1, 6],
    // Continue scanning
    [8, 3, 4, 5, 2, 9, 1, 6],
    // Second swap
    [8, 3, 4, 2, 5, 9, 1, 6],
    // Final swap
    [8, 3, 4, 2, 1, 9, 5, 6],
    // Move pivot
    [1, 3, 4, 2, 8, 9, 5, 6],
    // Partition complete
    [1, 3, 4, 2, 8, 9, 5, 6]
  ];

  const currentArray = states[Math.min(Math.floor(phase / 3), states.length - 1)];
  const pivotIndex = phase < 24 ? 4 : null;
  const leftIndex = phase < 24 ? Math.min(0 + (phase % 3), 3) : null;
  const rightIndex = phase < 24 ? Math.max(7 - (phase % 3), 5) : null;

  return (
    <div className="w-full max-w-md p-6 bg-gradient-to-br from-violet-50 to-purple-100 rounded-xl shadow-xl">
      <div className="relative h-64 flex flex-col items-center justify-center bg-white/90 rounded-xl shadow-md overflow-hidden">
        {/* Decorative background with animated gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-50/50 to-purple-50/50" />
          <div className="absolute h-1 top-0 left-0 right-0 bg-gradient-to-r from-violet-500 via-purple-500 to-violet-500 animate-gradient" />
        </div>

        {/* Title with animated underline */}
        <div className="absolute top-4 left-0 right-0 text-center">
          <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-600">
            Partition Algorithm
          </h3>
          <div className="mt-1 text-sm text-gray-500">
            Rearranging elements around pivot
          </div>
        </div>

        {/* Array visualization */}
        <div className="relative mt-8">
          <div className="flex gap-2">
            {currentArray.map((num, idx) => (
              <div
                key={idx}
                className={`relative w-10 h-10 flex items-center justify-center rounded-lg
                  transition-all duration-500 ease-in-out transform
                  ${idx === pivotIndex ? 'border-2 border-purple-500 bg-purple-50 scale-110 shadow-md' :
                    idx === leftIndex ? 'border-2 border-violet-500 bg-violet-50 scale-105' :
                    idx === rightIndex ? 'border-2 border-pink-500 bg-pink-50 scale-105' :
                    idx < pivotIndex && num < currentArray[pivotIndex] ? 'border border-emerald-200 bg-emerald-50' :
                    idx > pivotIndex && num >= currentArray[pivotIndex] ? 'border border-amber-200 bg-amber-50' :
                    'border border-gray-200 bg-white'}`}
              >
                <span className={`font-semibold ${
                  idx === pivotIndex ? 'text-purple-700' :
                  idx === leftIndex ? 'text-violet-700' :
                  idx === rightIndex ? 'text-pink-700' :
                  idx < pivotIndex && num < currentArray[pivotIndex] ? 'text-emerald-600' :
                  idx > pivotIndex && num >= currentArray[pivotIndex] ? 'text-amber-600' :
                  'text-gray-600'
                }`}>
                  {num}
                </span>
                {(idx === pivotIndex || idx === leftIndex || idx === rightIndex) && (
                  <div className="absolute inset-0 animate-pulse opacity-20 rounded-lg"
                    style={{
                      backgroundColor: idx === pivotIndex ? '#9333EA' :
                                     idx === leftIndex ? '#7C3AED' : '#EC4899'
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Partition indicators */}
        <div className="absolute bottom-4 flex justify-center items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-purple-700">Pivot</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-emerald-700">&lt; Pivot</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-amber-700">≥ Pivot</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartitionGif;