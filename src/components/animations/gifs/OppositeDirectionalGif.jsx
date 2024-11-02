import React, { useEffect, useState } from 'react';
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';

const OppositeDirectionalGif = () => {
  const [position1, setPosition1] = useState(0);
  const [position2, setPosition2] = useState(100);
  const [direction, setDirection] = useState(1);
  const [activeIndices, setActiveIndices] = useState([0, 9]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (direction === 1) {
        if (position1 >= 42 || position2 <= 58) {
          setDirection(-1);
        } else {
          setPosition1(prev => prev + 2);
          setPosition2(prev => prev - 2);
          // Update active indices
          setActiveIndices([
            Math.floor(position1 / 10),
            Math.floor(position2 / 10)
          ]);
        }
      } else {
        if (position1 <= 0 || position2 >= 100) {
          setDirection(1);
        } else {
          setPosition1(prev => prev - 2);
          setPosition2(prev => prev + 2);
          // Update active indices
          setActiveIndices([
            Math.floor(position1 / 10),
            Math.floor(position2 / 10)
          ]);
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, [position1, position2, direction]);

  return (
    <div className="w-full max-w-md p-8 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg shadow-xl">
      <div className="relative h-32 flex items-center justify-center bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-50" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
        
        {/* Array representation */}
        <div className="absolute top-4 w-full flex justify-center">
          <div className="flex space-x-2">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={`w-8 h-8 flex items-center justify-center border-2 rounded-lg 
                  transition-all duration-300 transform
                  ${activeIndices.includes(i) 
                    ? 'border-purple-500 bg-purple-100 scale-110 shadow-lg' 
                    : 'border-gray-200 bg-white'
                  }
                  ${i === Math.min(...activeIndices) ? 'animate-pulse' : ''}
                  ${i === Math.max(...activeIndices) ? 'animate-pulse' : ''}`}
              >
                <span className={`font-semibold ${
                  activeIndices.includes(i) ? 'text-purple-700' : 'text-gray-600'
                }`}>
                  {i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Connection line */}
        <div 
          className="absolute bottom-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-100"
          style={{
            left: `${position1}%`,
            width: `${position2 - position1}%`,
          }}
        />
        
        {/* Left pointer */}
        <div 
          className="absolute bottom-8 transition-all duration-100 transform hover:scale-110"
          style={{ left: `${position1}%` }}
        >
          <div className="relative">
            <ArrowLeftCircle 
              size={24} 
              className="text-blue-600 filter drop-shadow-lg" 
            />
            <div className="absolute -top-1 -left-1 w-6 h-6 bg-blue-400 rounded-full animate-ping opacity-20" />
          </div>
        </div>
        
        {/* Right pointer */}
        <div 
          className="absolute bottom-8 transition-all duration-100 transform hover:scale-110"
          style={{ left: `${position2}%` }}
        >
          <div className="relative">
            <ArrowRightCircle 
              size={24} 
              className="text-purple-600 filter drop-shadow-lg" 
            />
            <div className="absolute -top-1 -left-1 w-6 h-6 bg-purple-400 rounded-full animate-ping opacity-20" />
          </div>
        </div>

        {/* Current indices display */}
        <div className="absolute bottom-1 left-0 w-full flex justify-center space-x-4 text-sm">
          <span className="text-blue-600 font-semibold">
            Left: {Math.floor(position1 / 10) + 1}
          </span>
          <span className="text-purple-600 font-semibold">
            Right: {Math.floor(position2 / 10) + 1}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OppositeDirectionalGif;