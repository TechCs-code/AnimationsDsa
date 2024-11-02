import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, Pause, Play } from 'lucide-react';

const SlidingWindowGif = () => {
  const [windowStart, setWindowStart] = useState(0);
  const [windowSize, setWindowSize] = useState(3);
  const [isFixedSize, setIsFixedSize] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [sum, setSum] = useState(0);

  // Smaller array to prevent overflow
  const array = [4, 2, 7, 1, 9, 3, 6, 5];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (isFixedSize) {
        setWindowStart(prev => {
          if (prev + windowSize >= array.length) return 0;
          return prev + 1;
        });
      } else {
        setWindowSize(prev => {
          if (prev >= 5) return 2;
          return prev + 1;
        });
      }
    }, 1500);

    const currentSum = array
      .slice(windowStart, windowStart + windowSize)
      .reduce((acc, curr) => acc + curr, 0);
    setSum(currentSum);

    return () => clearInterval(interval);
  }, [windowStart, windowSize, isFixedSize, array, isPlaying]);

  return (
    <div className="w-full max-w-xl p-6 bg-gradient-to-br from-indigo-50 to-violet-100 rounded-lg shadow-xl">
      <div className="relative h-80 flex flex-col items-center justify-center bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-violet-50 opacity-40" />
        
        {/* Header */}
        <div className="absolute top-4 w-full px-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
            Sliding Window
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setIsFixedSize(!isFixedSize)}
              className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-lg
                text-sm font-medium flex items-center gap-1.5 hover:shadow-md transition-all duration-300
                transform hover:scale-102"
            >
              <SlidersHorizontal size={14} />
              <span>{isFixedSize ? 'Fixed' : 'Variable'}</span>
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-lg
                hover:shadow-md transition-all duration-300 transform hover:scale-102"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>
          </div>
        </div>

        {/* Array visualization */}
        <div className="relative mt-8">
          <div className="flex gap-2">
            {array.map((num, idx) => (
              <div
                key={idx}
                className={`relative w-10 h-10 flex items-center justify-center rounded-lg
                  transition-all duration-500 ease-in-out transform
                  ${idx >= windowStart && idx < windowStart + windowSize
                    ? 'border-2 border-indigo-400 bg-gradient-to-br from-indigo-50 to-violet-50 scale-105 shadow-md'
                    : 'border border-gray-200 bg-white'}`}
              >
                <span className={`font-semibold transition-all duration-500 ${
                  idx >= windowStart && idx < windowStart + windowSize
                    ? 'text-indigo-600'
                    : 'text-gray-500'
                }`}>
                  {num}
                </span>
                {idx >= windowStart && idx < windowStart + windowSize && (
                  <div className="absolute inset-0 bg-indigo-400 animate-pulse opacity-10 rounded-lg" />
                )}
              </div>
            ))}
          </div>

          {/* Window overlay */}
          <div
            className="absolute top-0 h-10 border-2 border-violet-400/50 rounded-lg
              transition-all duration-500 ease-in-out backdrop-blur-[1px] bg-violet-100/10"
            style={{
              left: `${windowStart * 3}rem`,
              width: `${windowSize * 3 - 0.5}rem`,
            }}
          />
        </div>

        {/* Window information */}
        <div className="absolute bottom-4 w-full px-4">
          <div className="bg-white/90 rounded-lg p-3 shadow-sm border border-indigo-100">
            <div className="flex justify-center items-center gap-6 text-sm">
              <span className="text-indigo-600 font-medium">
                Start: {windowStart}
              </span>
              <span className="text-violet-600 font-medium">
                Size: {windowSize}
              </span>
              <span className="text-indigo-600 font-medium">
                Sum: {sum}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlidingWindowGif;