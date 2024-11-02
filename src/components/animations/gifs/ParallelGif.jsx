import React, { useEffect, useState } from 'react';
import { ArrowDown, Play, RotateCcw, Pause } from 'lucide-react';

const ParallelGif = () => {
  const [array1] = useState([2, 4, 6, 8, 9]);
  const [array2] = useState([1, 3, 5, 7, 10]);
  const [pointer1, setPointer1] = useState(0);
  const [pointer2, setPointer2] = useState(0);
  const [mergedArray, setMergedArray] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [comparing, setComparing] = useState(true);
  
  useEffect(() => {
    if (!isPlaying || isComplete) return;

    const interval = setInterval(() => {
      if (pointer1 < array1.length && pointer2 < array2.length) {
        if (comparing) {
          setComparing(false);
          // Add visual delay before making decision
        } else {
          if (array1[pointer1] < array2[pointer2]) {
            setMergedArray(prev => [...prev, array1[pointer1]]);
            setPointer1(p => p + 1);
          } else {
            setMergedArray(prev => [...prev, array2[pointer2]]);
            setPointer2(p => p + 1);
          }
          setComparing(true);
        }
      } else {
        // Handle remaining elements
        if (pointer1 < array1.length) {
          setMergedArray(prev => [...prev, array1[pointer1]]);
          setPointer1(p => p + 1);
        }
        if (pointer2 < array2.length) {
          setMergedArray(prev => [...prev, array2[pointer2]]);
          setPointer2(p => p + 1);
        }
        if (pointer1 >= array1.length && pointer2 >= array2.length) {
          setIsComplete(true);
        }
      }
    }, 800);

    return () => clearInterval(interval);
  }, [pointer1, pointer2, array1, array2, isPlaying, isComplete, comparing]);

  const resetAnimation = () => {
    setPointer1(0);
    setPointer2(0);
    setMergedArray([]);
    setIsComplete(false);
    setIsPlaying(true);
    setComparing(true);
  };

  return (
    <div className="w-full max-w-xl p-6 bg-gradient-to-br from-cyan-50 to-teal-100 rounded-lg shadow-xl">
      <div className="relative h-96 flex flex-col items-center justify-center bg-white/90 rounded-xl shadow-lg overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-50/50 to-teal-50/50" />
          <div className="absolute h-1 top-0 left-0 right-0 bg-gradient-to-r from-cyan-500 to-teal-500" />
        </div>

        {/* Controls */}
        <div className="absolute top-4 w-full px-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-teal-600">
            Parallel Two-Pointer
          </h3>
          <div className="flex gap-2">
            <button
              onClick={resetAnimation}
              className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg
                text-sm font-medium flex items-center gap-1.5 hover:shadow-md transition-all duration-300"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg
                hover:shadow-md transition-all duration-300"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>
          </div>
        </div>

        {/* Array visualizations */}
        <div className="space-y-12">
          {/* First Array */}
          <div className="relative">
            <div className="flex gap-2">
              {array1.map((num, idx) => (
                <div
                  key={idx}
                  className={`relative w-12 h-12 flex items-center justify-center rounded-lg
                    transition-all duration-300 ease-in-out transform
                    ${idx === pointer1 ? 'border-2 border-cyan-500 bg-cyan-50 scale-110 shadow-md' :
                      idx < pointer1 ? 'border border-gray-200 bg-gray-50 opacity-50' :
                      'border border-gray-200 bg-white'}`}
                >
                  <span className={`font-semibold ${
                    idx === pointer1 ? 'text-cyan-700' : 'text-gray-600'
                  }`}>
                    {num}
                  </span>
                  {idx === pointer1 && comparing && (
                    <div className="absolute -bottom-8 text-cyan-500">
                      <ArrowDown className="animate-bounce" size={20} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Second Array */}
          <div className="relative">
            <div className="flex gap-2">
              {array2.map((num, idx) => (
                <div
                  key={idx}
                  className={`relative w-12 h-12 flex items-center justify-center rounded-lg
                    transition-all duration-300 ease-in-out transform
                    ${idx === pointer2 ? 'border-2 border-teal-500 bg-teal-50 scale-110 shadow-md' :
                      idx < pointer2 ? 'border border-gray-200 bg-gray-50 opacity-50' :
                      'border border-gray-200 bg-white'}`}
                >
                  <span className={`font-semibold ${
                    idx === pointer2 ? 'text-teal-700' : 'text-gray-600'
                  }`}>
                    {num}
                  </span>
                  {idx === pointer2 && comparing && (
                    <div className="absolute -top-8 text-teal-500">
                      <ArrowDown className="animate-bounce rotate-180" size={20} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Merged Array */}
          <div className="relative pt-6 border-t border-gray-200">
            <div className="flex gap-2">
              {mergedArray.map((num, idx) => (
                <div
                  key={idx}
                  className="w-12 h-12 flex items-center justify-center rounded-lg
                    border border-emerald-200 bg-emerald-50
                    transition-all duration-300 ease-in-out transform
                    animate-fade-in"
                >
                  <span className="font-semibold text-emerald-700">{num}</span>
                </div>
              ))}
              {isComplete && (
                <div className="absolute -top-4 left-0 right-0 text-center text-sm text-emerald-600 font-medium">
                  Merged Result
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParallelGif;