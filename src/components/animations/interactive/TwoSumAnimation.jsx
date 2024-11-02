import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeftRight, ArrowRight, CheckCircle2, XCircle, Play, SkipForward, RotateCcw } from 'lucide-react';

const TwoSumAnimation = () => {
  const [array] = useState([2, 3, 4, 6, 8, 9, 11, 13]);
  const [target, setTarget] = useState(10);
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(array.length - 1);
  const [currentSum, setCurrentSum] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [found, setFound] = useState(false);
  const [currentLine, setCurrentLine] = useState(1);
  const [description, setDescription] = useState('Click Start or Next Step to begin');
  const [algorithmStep, setAlgorithmStep] = useState('initialize');
  const [isComplete, setIsComplete] = useState(false);

  const code = [
    'def two_sum_sorted(arr, target):',
    '    left, right = 0, len(arr) - 1',
    '    while left < right:',
    '        current_sum = arr[left] + arr[right]',
    '        if current_sum == target:',
    '            return (left, right)',
    '        elif current_sum < target:',
    '            left += 1',
    '        else:',
    '            right -= 1',
    '    return -1'
  ];

  const reset = () => {
    setLeft(0);
    setRight(array.length - 1);
    setCurrentSum(null);
    setFound(false);
    setCurrentLine(1);
    setDescription('Click Start or Next Step to begin');
    setIsRunning(false);
    setAlgorithmStep('initialize');
    setIsComplete(false);
  };

  const getStepExplanation = (step) => {
    switch (step) {
      case 'initialize':
        return {
          title: "Initialization",
          detail: "Setting up left pointer at index 0 and right pointer at last index",
          visualization: "→ Initial array setup with two pointers"
        };
      case 'check_sum':
        return {
          title: "Calculate Current Sum",
          detail: `Adding values at left (${array[left]}) and right (${array[right]}) pointers`,
          visualization: `${array[left]} + ${array[right]} = ${currentSum}`
        };
      case 'compare':
        return {
          title: "Compare with Target",
          detail: `Comparing current sum (${currentSum}) with target (${target})`,
          visualization: `${currentSum} ${currentSum === target ? '=' : currentSum < target ? '<' : '>'} ${target}`
        };
      case 'move_pointer':
        return {
          title: "Adjust Pointers",
          detail: currentSum < target ? 
            "Sum is too small, moving left pointer right" :
            "Sum is too large, moving right pointer left",
          visualization: currentSum < target ? "Moving → left pointer" : "Moving ← right pointer"
        };
      default:
        return {
          title: "Complete",
          detail: found ? "Found matching pair!" : "No solution found",
          visualization: found ? `Solution: ${array[left]} + ${array[right]} = ${target}` : "No pair sums to target"
        };
    }
  };

  const nextStep = () => {
    if (isComplete) return;

    switch (algorithmStep) {
      case 'initialize':
        setCurrentLine(2);
        setCurrentSum(array[left] + array[right]);
        setAlgorithmStep('check_sum');
        break;

      case 'check_sum':
        setCurrentLine(4);
        setAlgorithmStep('compare');
        break;

      case 'compare':
        if (currentSum === target) {
          setFound(true);
          setCurrentLine(5);
          setIsComplete(true);
          setAlgorithmStep('complete');
        } else {
          setCurrentLine(currentSum < target ? 7 : 9);
          setAlgorithmStep('move_pointer');
        }
        break;

      case 'move_pointer':
        if (currentSum < target) {
          setLeft(prev => prev + 1);
        } else {
          setRight(prev => prev - 1);
        }
        
        if (left >= right - 1) {
          setIsComplete(true);
          setAlgorithmStep('complete');
          setCurrentLine(10);
        } else {
          setAlgorithmStep('check_sum');
          setCurrentSum(currentSum < target ? 
            array[left + 1] + array[right] : 
            array[left] + array[right - 1]);
        }
        break;
    }
  };

  const stepExplanation = getStepExplanation(algorithmStep);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Two Sum Algorithm Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Controls */}
          <div className="flex gap-4 items-center">
            <Input 
              type="number" 
              value={target}
              onChange={(e) => setTarget(parseInt(e.target.value))}
              className="w-24"
              placeholder="Target"
            />
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

          {/* Current Step Information */}
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

          {/* Array Visualization */}
          <div className="relative bg-slate-100 p-4 rounded-lg">
            <div className="flex justify-center gap-2">
              {array.map((num, idx) => (
                <div
                  key={idx}
                  className={`
                    w-12 h-12 flex items-center justify-center rounded-lg
                    ${idx === left ? 'bg-blue-500 text-white' : 
                      idx === right ? 'bg-green-500 text-white' : 
                      'bg-white'}
                    ${found && (idx === left || idx === right) ? 'ring-4 ring-yellow-400' : ''}
                    shadow-md transition-all duration-300
                  `}
                >
                  {num}
                </div>
              ))}
            </div>
            
            {/* Current Sum Display */}
            {currentSum !== null && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-lg shadow-lg">
                {array[left]} + {array[right]} = {currentSum}
              </div>
            )}
          </div>

          {/* Code Display */}
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

export default TwoSumAnimation;