import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, RotateCcw, SkipForward } from 'lucide-react';

const SortColorsAnimation = () => {
  const [array, setArray] = useState([2, 0, 1, 1, 0, 2, 1, 2, 0]);
  const [low, setLow] = useState(0);
  const [cur, setCur] = useState(0);
  const [high, setHigh] = useState(array.length - 1);
  const [currentLine, setCurrentLine] = useState(1);
  const [algorithmStep, setAlgorithmStep] = useState('initialize');
  const [isComplete, setIsComplete] = useState(false);
  const [swapping, setSwapping] = useState({ from: null, to: null });

  const getColorClass = (value) => {
    switch(value) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-white';
      case 2: return 'bg-blue-500';
      default: return 'bg-gray-200';
    }
  };

  const getTextClass = (value) => {
    return value === 1 ? 'text-black' : 'text-white';
  };

  const code = [
    'def sort_colors(arr):',
    '    low, cur, high = 0, 0, len(arr) - 1',
    '    while cur <= high:',
    '        if arr[cur] == 0:',
    '            arr[low], arr[cur] = arr[cur], arr[low]',
    '            low += 1',
    '            cur += 1',
    '        elif arr[cur] == 1:',
    '            cur += 1',
    '        else:  # arr[cur] == 2',
    '            arr[cur], arr[high] = arr[high], arr[cur]',
    '            high -= 1'
  ];

  const getStepExplanation = (step) => {
    switch (step) {
      case 'initialize':
        return {
          title: "Initialization",
          detail: "Initialize pointers: low, cur at start and high at end",
          visualization: "Setting up low = 0, cur = 0, high = " + (array.length - 1)
        };
      case 'check_value':
        return {
          title: "Check Current Value",
          detail: `Checking value at cur (${cur}): ${array[cur]}`,
          visualization: array[cur] === 0 ? "Value is 0 (red) - will swap with low" :
                        array[cur] === 1 ? "Value is 1 (white) - will move cur" :
                        "Value is 2 (blue) - will swap with high"
        };
      case 'swap_low':
        return {
          title: "Swap with Low",
          detail: `Swapping elements at positions cur (${cur}) and low (${low})`,
          visualization: `${array[cur]} ↔ ${array[low]}`
        };
      case 'swap_high':
        return {
          title: "Swap with High",
          detail: `Swapping elements at positions cur (${cur}) and high (${high})`,
          visualization: `${array[cur]} ↔ ${array[high]}`
        };
      case 'move_pointers':
        return {
          title: "Move Pointers",
          detail: array[cur] === 0 ? "Moving both low and cur forward" :
                 array[cur] === 1 ? "Moving cur forward" :
                 "Moving high backward",
          visualization: `low: ${low}, cur: ${cur}, high: ${high}`
        };
      case 'complete':
        return {
          title: "Algorithm Complete",
          detail: "Array is now sorted by colors",
          visualization: "Red (0s) | White (1s) | Blue (2s)"
        };
      default:
        return {
          title: "Ready",
          detail: "Click Next Step to begin",
          visualization: "Algorithm ready to start"
        };
    }
  };

  const swap = (arr, i, j) => {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  };

  const reset = () => {
    setArray([2, 0, 1, 1, 0, 2, 1, 2, 0]);
    setLow(0);
    setCur(0);
    setHigh(array.length - 1);
    setCurrentLine(1);
    setAlgorithmStep('initialize');
    setIsComplete(false);
    setSwapping({ from: null, to: null });
  };

  const nextStep = () => {
    if (isComplete) return;

    switch (algorithmStep) {
      case 'initialize':
        setCurrentLine(2);
        setAlgorithmStep('check_value');
        break;

      case 'check_value':
        if (cur > high) {
          setAlgorithmStep('complete');
          setIsComplete(true);
          break;
        }
        setCurrentLine(array[cur] === 0 ? 4 : array[cur] === 1 ? 8 : 10);
        setAlgorithmStep(array[cur] === 0 ? 'swap_low' : 
                        array[cur] === 1 ? 'move_pointers' : 'swap_high');
        break;

      case 'swap_low':
        setSwapping({ from: cur, to: low });
        const newArrayLow = [...array];
        swap(newArrayLow, cur, low);
        setArray(newArrayLow);
        setCurrentLine(5);
        setAlgorithmStep('move_pointers');
        break;

      case 'swap_high':
        setSwapping({ from: cur, to: high });
        const newArrayHigh = [...array];
        swap(newArrayHigh, cur, high);
        setArray(newArrayHigh);
        setCurrentLine(11);
        setAlgorithmStep('move_pointers');
        break;

      case 'move_pointers':
        setSwapping({ from: null, to: null });
        if (array[cur] === 0) {
          setLow(low + 1);
          setCur(cur + 1);
        } else if (array[cur] === 1) {
          setCur(cur + 1);
        } else {
          setHigh(high - 1);
        }
        setCurrentLine(3);
        setAlgorithmStep('check_value');
        break;
    }
  };

  const stepExplanation = getStepExplanation(algorithmStep);

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <CardTitle>Dutch National Flag (Sort Colors)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex gap-4">
            <Button 
              onClick={nextStep} 
              disabled={isComplete}
              className="gap-2"
            >
              <SkipForward className="w-4 h-4" />
              Next Step
            </Button>
            <Button 
              onClick={reset}
              variant="outline"
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <ArrowRight className="w-5 h-5" />
              {stepExplanation.title}
            </h3>
            <p className="text-slate-600 mb-2">{stepExplanation.detail}</p>
            <div className="bg-white p-2 rounded border border-slate-200">
              {stepExplanation.visualization}
            </div>
          </div>

          <div className="relative bg-slate-100 p-8 rounded-lg">
            <div className="flex justify-center gap-1">
              {array.map((num, idx) => (
                <div key={idx} className="relative">
                  <div
                    className={`
                      w-16 h-16 flex items-center justify-center rounded-lg
                      ${getColorClass(num)}
                      ${idx === low ? 'ring-2 ring-green-400' : ''}
                      ${idx === cur ? 'ring-2 ring-yellow-400' : ''}
                      ${idx === high ? 'ring-2 ring-purple-400' : ''}
                      ${(swapping.from === idx || swapping.to === idx) ? 'scale-110 transition-transform' : ''}
                      shadow-md text-lg font-bold transition-all duration-300
                      ${getTextClass(num)}
                    `}
                  >
                    {num}
                  </div>
                  <div className="absolute -bottom-8 left-0 w-full text-center text-sm text-gray-500">
                    {idx}
                  </div>
                  {idx === low && (
                    <div className="absolute -top-6 left-0 w-full text-center text-sm text-green-600 font-semibold">
                      low
                    </div>
                  )}
                  {idx === cur && (
                    <div className="absolute -top-6 left-0 w-full text-center text-sm text-yellow-600 font-semibold">
                      cur
                    </div>
                  )}
                  {idx === high && (
                    <div className="absolute -top-6 left-0 w-full text-center text-sm text-purple-600 font-semibold">
                      high
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-6 justify-center text-sm bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>0 (Red)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
              <span>1 (White)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>2 (Blue)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-green-400 rounded"></div>
              <span>Low Pointer</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-yellow-400 rounded"></div>
              <span>Current Pointer</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-purple-400 rounded"></div>
              <span>High Pointer</span>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-4 rounded-lg font-mono text-sm">
            {code.map((line, idx) => (
              <div
                key={idx}
                className={`
                  ${currentLine === idx ? 'bg-blue-500/20' : ''}
                  ${currentLine === idx ? 'border-l-2 border-blue-500' : ''}
                  pl-4 py-1
                `}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SortColorsAnimation;