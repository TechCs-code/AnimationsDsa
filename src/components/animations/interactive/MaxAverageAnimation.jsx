import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, RotateCcw, SkipForward } from 'lucide-react';

const MaxAverageAnimation = () => {
  const [array] = useState([3, 1, 4, 7, 2, 8, 5, 6]);
  const k = 3; // Window size
  
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [windowSum, setWindowSum] = useState(0);
  const [maxAverage, setMaxAverage] = useState(Number.NEGATIVE_INFINITY);
  const [currentLine, setCurrentLine] = useState(1);
  const [algorithmStep, setAlgorithmStep] = useState('initialize');
  const [isComplete, setIsComplete] = useState(false);
  const [maxAverageWindow, setMaxAverageWindow] = useState({ start: 0, end: 0 });

  const code = [
    'def max_average_subarray(arr, k):',
    '    left, right, window_sum = 0, 0, 0',
    '    max_average = float(\'-inf\')',
    '    while right < len(arr):',
    '        window_sum += arr[right]',
    '        if right - left + 1 == k:',
    '            max_average = max(max_average, window_sum / k)',
    '            window_sum -= arr[left]',
    '            left += 1',
    '        right += 1',
    '    return max_average'
  ];

  const getStepExplanation = (step) => {
    switch (step) {
      case 'initialize':
        return {
          title: "Initialization",
          detail: "Initialize pointers and variables",
          visualization: "Setting up left = 0, right = 0, window_sum = 0"
        };
      case 'add_element':
        return {
          title: "Add Element",
          detail: `Adding element ${array[right]} to window`,
          visualization: `Window sum: ${windowSum} + ${array[right]} = ${windowSum + array[right]}`
        };
      case 'check_window':
        return {
          title: "Check Window",
          detail: `Window size is ${right - left + 1}`,
          visualization: `Current average: ${(windowSum / k).toFixed(2)}`
        };
      case 'update_max':
        return {
          title: "Update Maximum",
          detail: "Comparing current average with maximum average",
          visualization: `Max average: ${maxAverage.toFixed(2)} → ${Math.max(maxAverage, windowSum / k).toFixed(2)}`
        };
      case 'slide_window':
        return {
          title: "Slide Window",
          detail: "Moving window forward",
          visualization: `Removing ${array[left]} from sum and moving left pointer`
        };
      case 'complete':
        return {
          title: "Algorithm Complete",
          detail: "Found maximum average subarray",
          visualization: `Maximum average: ${maxAverage.toFixed(2)} (indices ${maxAverageWindow.start} to ${maxAverageWindow.end})`
        };
      default:
        return {
          title: "Ready",
          detail: "Click Next Step to begin",
          visualization: "Algorithm ready to start"
        };
    }
  };

  const reset = () => {
    setLeft(0);
    setRight(0);
    setWindowSum(0);
    setMaxAverage(Number.NEGATIVE_INFINITY);
    setCurrentLine(1);
    setAlgorithmStep('initialize');
    setIsComplete(false);
    setMaxAverageWindow({ start: 0, end: 0 });
  };

  const nextStep = () => {
    if (isComplete) return;

    switch (algorithmStep) {
      case 'initialize':
        setCurrentLine(2);
        setAlgorithmStep('add_element');
        break;

      case 'add_element':
        setWindowSum(prev => prev + array[right]);
        setCurrentLine(5);
        setAlgorithmStep('check_window');
        break;

      case 'check_window':
        if (right - left + 1 === k) {
          setCurrentLine(7);
          setAlgorithmStep('update_max');
        } else {
          setCurrentLine(10);
          setRight(prev => prev + 1);
          setAlgorithmStep(right + 1 < array.length ? 'add_element' : 'complete');
        }
        break;

      case 'update_max':
        const currentAverage = windowSum / k;
        if (currentAverage > maxAverage) {
          setMaxAverage(currentAverage);
          setMaxAverageWindow({ start: left, end: right });
        }
        setCurrentLine(8);
        setAlgorithmStep('slide_window');
        break;

      case 'slide_window':
        setWindowSum(prev => prev - array[left]);
        setLeft(prev => prev + 1);
        setRight(prev => prev + 1);
        setCurrentLine(10);
        setAlgorithmStep(right + 1 < array.length ? 'add_element' : 'complete');
        break;

      case 'complete':
        setIsComplete(true);
        break;
    }
  };

  const stepExplanation = getStepExplanation(algorithmStep);

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <CardTitle>Maximum Average Subarray (Window Size: {k})</CardTitle>
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
                      ${idx >= left && idx <= right ? 'bg-blue-100 border-2 border-blue-500' : 'bg-white border border-gray-300'}
                      ${(maxAverageWindow.start <= idx && idx <= maxAverageWindow.end && isComplete) ? 'ring-2 ring-yellow-400' : ''}
                      shadow-md text-lg font-bold transition-all duration-300
                    `}
                  >
                    {num}
                  </div>
                  <div className="absolute -bottom-6 left-0 w-full text-center text-sm text-gray-500">
                    {idx}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-center gap-8">
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Window Sum</div>
                <div className="text-xl font-bold">{windowSum}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Current Average</div>
                <div className="text-xl font-bold">
                  {(windowSum / k || 0).toFixed(2)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Max Average</div>
                <div className="text-xl font-bold">
                  {maxAverage === Number.NEGATIVE_INFINITY ? '0.00' : maxAverage.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-6 justify-center text-sm bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border-2 border-blue-500 rounded"></div>
              <span>Current Window</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border-2 border-yellow-400 rounded"></div>
              <span>Maximum Average Window</span>
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

export default MaxAverageAnimation;