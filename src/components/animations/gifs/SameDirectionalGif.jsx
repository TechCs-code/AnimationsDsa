import React, { useEffect, useState } from 'react';
import { Rabbit, Turtle } from 'lucide-react';

const SameDirectionalGif = () => {
  const [slowPosition, setSlowPosition] = useState(0);
  const [fastPosition, setFastPosition] = useState(0);
  const [isMoving, setIsMoving] = useState(true);

  // Create circular linked list representation
  const nodes = 8;
  const nodePositions = [...Array(nodes)].map((_, i) => ({
    x: Math.cos(2 * Math.PI * i / nodes) * 120,
    y: Math.sin(2 * Math.PI * i / nodes) * 120,
  }));

  useEffect(() => {
    if (!isMoving) return;

    const interval = setInterval(() => {
      setSlowPosition(prev => (prev + 1) % nodes);
      setFastPosition(prev => (prev + 2) % nodes);

      // Stop when they meet
      if ((fastPosition + 2) % nodes === (slowPosition + 1) % nodes) {
        setIsMoving(false);
        setTimeout(() => setIsMoving(true), 1000);
        setTimeout(() => {
          setSlowPosition(0);
          setFastPosition(0);
        }, 800);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [slowPosition, fastPosition, isMoving, nodes]);

  return (
    <div className="w-full max-w-md p-8 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-lg shadow-xl">
      <div className="relative h-96 flex items-center justify-center bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-teal-50 opacity-50" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
        
        {/* Title */}
        <div className="absolute top-4 text-center">
          <h3 className="text-lg font-semibold text-gray-700">Floyd's Cycle Detection</h3>
          <p className="text-sm text-gray-500">Tortoise and Hare Algorithm</p>
        </div>

        {/* Circular Linked List */}
        <div className="relative w-64 h-64">
          {/* Connecting lines */}
          {nodePositions.map((pos, i) => {
            const nextPos = nodePositions[(i + 1) % nodes];
            const dx = nextPos.x - pos.x;
            const dy = nextPos.y - pos.y;
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            const length = Math.sqrt(dx * dx + dy * dy);
            
            return (
              <div
                key={i}
                className="absolute h-0.5 bg-gradient-to-r from-emerald-300 to-teal-300 origin-left"
                style={{
                  left: `${pos.x + 132}px`,
                  top: `${pos.y + 132}px`,
                  width: `${length}px`,
                  transform: `rotate(${angle}deg)`,
                }}
              />
            );
          })}

          {/* Nodes */}
          {nodePositions.map((pos, i) => (
            <div
              key={i}
              className={`absolute w-12 h-12 -ml-6 -mt-6 flex items-center justify-center 
                rounded-full border-2 transition-all duration-300 transform
                ${i === slowPosition || i === fastPosition 
                  ? 'border-emerald-500 bg-emerald-100 scale-110 shadow-lg' 
                  : 'border-gray-200 bg-white'}`}
              style={{
                left: `${pos.x + 132}px`,
                top: `${pos.y + 132}px`,
              }}
            >
              <span className={`font-semibold ${
                i === slowPosition || i === fastPosition ? 'text-emerald-700' : 'text-gray-600'
              }`}>
                {i + 1}
              </span>
            </div>
          ))}

          {/* Slow pointer (Turtle) */}
          <div
            className="absolute w-8 h-8 transition-all duration-500 ease-in-out transform -ml-4 -mt-4"
            style={{
              left: `${nodePositions[slowPosition].x + 132}px`,
              top: `${nodePositions[slowPosition].y + 132}px`,
            }}
          >
            <div className="relative">
              <Turtle 
                size={24} 
                className="text-emerald-600 filter drop-shadow-lg" 
              />
              <div className="absolute -top-1 -left-1 w-6 h-6 bg-emerald-400 rounded-full animate-ping opacity-20" />
            </div>
          </div>

          {/* Fast pointer (Rabbit) */}
          <div
            className="absolute w-8 h-8 transition-all duration-500 ease-in-out transform -ml-4 -mt-4"
            style={{
              left: `${nodePositions[fastPosition].x + 132}px`,
              top: `${nodePositions[fastPosition].y + 132}px`,
            }}
          >
            <div className="relative">
              <Rabbit 
                size={24} 
                className="text-teal-600 filter drop-shadow-lg" 
              />
              <div className="absolute -top-1 -left-1 w-6 h-6 bg-teal-400 rounded-full animate-ping opacity-20" />
            </div>
          </div>
        </div>

        {/* Status display */}
        <div className="absolute bottom-4 flex space-x-8 text-sm">
          <span className="text-emerald-600 font-semibold flex items-center">
            <Turtle size={16} className="mr-1" /> Position: {slowPosition + 1}
          </span>
          <span className="text-teal-600 font-semibold flex items-center">
            <Rabbit size={16} className="mr-1" /> Position: {fastPosition + 1}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SameDirectionalGif;