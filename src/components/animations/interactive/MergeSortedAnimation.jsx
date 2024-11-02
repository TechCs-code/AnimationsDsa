import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, RotateCcw, SkipForward } from 'lucide-react';

const MergeSortedAnimation = () => {
  const [array1] = useState([2, 4, 6, 8, 10]);
  const [array2] = useState([1, 3, 5, 7, 9]);
  const [result, setResult] = useState([]);
  const [i, setI] = useState(0);
  const [j, setJ] = useState(0);
  const [currentLine, setCurrentLine] = useState(1);
  const [algorithmStep, setAlgorithmStep] = useState('initialize');
  const [isComplete, setIsComplete] = useState(false);
  const [lastAction, setLastAction] = useState(null);
  const [comparing, setComparing] = useState({ i: null, j: null });

  const code = [
    'def merge_sorted(arr1, arr2):',
    '    i, j = 0, 0',
    '    result = []',
    '    while i < len(arr1) and j < len(arr2):',
    '        if arr1[i] < arr2[j]:',
    '            result.append(arr1[i])',
    '            i += 1',
    '        else:',
    '            result.append(arr2[j])',
    '            j += 1',
    '    result.extend(arr1[i:])',
    '    result.extend(arr2[j:])',
    '    return result'
  ];

  const getStepExplanation = (step) => {
    switch (step) {
      case 'initialize':
        return {
          title: "Initialization",
          detail: "Initialize pointers and result array",
          visualization: "Setting up i = 0, j = 0, empty result array"
        };
      case 'compare':
        if (i < array1.length && j < array2.length) {
          return {
            title: "Compare Elements",
            detail: `Comparing array1[${i}] = ${array1[i]} with array2[${j}] = ${array2[j]}`,
            visualization: `${array1[i]} ${array1[i] < array2[j] ? '<' : '≥'} ${array2[j]}`
          };
        } else {
          return {
            title: "Arrays Exhausted",
            detail: "One or both arrays are exhausted",
            visualization: "Moving to remaining elements"
          };
        }
      case 'add_element':
        return {
          title: "Add Element",
          detail: lastAction === 'array1' ? 
            `Adding ${array1[i-1]} from array1` : 
            `Adding ${array2[j-1]} from array2`,
          visualization: `Result: [${result.join(', ')}]`
        };
      case 'remaining':
        return {
          title: "Add Remaining Elements",
          detail: i < array1.length ? 
            "Adding remaining elements from array1" : 
            "Adding remaining elements from array2",
          visualization: "Copying remaining elements to result"
        };
      case 'complete':
        return {
          title: "Merge Complete",
          detail: "Arrays successfully merged",
          visualization: `Final result: [${result.join(', ')}]`
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
    setResult([]);
    setI(0);
    setJ(0);
    setCurrentLine(1);
    setAlgorithmStep('initialize');
    setIsComplete(false);
    setLastAction(null);
    setComparing({ i: null, j: null });
  };

  const nextStep = () => {
    if (isComplete) return;

    switch (algorithmStep) {
      case 'initialize':
        setCurrentLine(2);
        setAlgorithmStep('compare');
        break;

      case 'compare':
        if (i < array1.length && j < array2.length) {
          setComparing({ i, j });
          setCurrentLine(4);
          setAlgorithmStep('add_element');
        } else {
          setCurrentLine(10);
          setAlgorithmStep('remaining');
        }
        break;

      case 'add_element':
        if (array1[i] < array2[j]) {
          setResult([...result, array1[i]]);
          setI(i + 1);
          setLastAction('array1');
          setCurrentLine(6);
        } else {
          setResult([...result, array2[j]]);
          setJ(j + 1);
          setLastAction('array2');
          setCurrentLine(8);
        }
        setComparing({ i: null, j: null });
        setAlgorithmStep('compare');
        break;

      case 'remaining':
        if (i < array1.length) {
          setResult([...result, ...array1.slice(i)]);
          setI(array1.length);
        }
        if (j < array2.length) {
          setResult([...result, ...array2.slice(j)]);
          setJ(array2.length);
        }
        setCurrentLine(11);
        setAlgorithmStep('complete');
        setIsComplete(true);
        break;
    }
  };

  const stepExplanation = getStepExplanation(algorithmStep);

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <CardTitle>Merge Sorted Arrays</CardTitle>
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

          <div className="relative bg-slate-100 p-8 rounded-lg space-y-8">
            {/* Array 1 */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-sm font-semibold text-gray-500">Array 1</div>
              <div className="flex justify-center gap-1">
                {array1.map((num, idx) => (
                  <div key={`arr1-${idx}`} className="relative">
                    <div
                      className={`
                        w-16 h-16 flex items-center justify-center rounded-lg
                        ${idx === i ? 'ring-2 ring-blue-500' : ''}
                        ${comparing.i === idx ? 'bg-blue-100' : 'bg-white'}
                        ${idx < i ? 'opacity-50' : ''}
                        ${lastAction === 'array1' && idx === i - 1 ? 'scale-110' : ''}
                        shadow-md text-lg font-bold transition-all duration-300
                      `}
                    >
                      {num}
                    </div>
                    <div className="absolute -bottom-6 left-0 w-full text-center text-sm text-gray-500">
                      {idx}
                    </div>
                    {idx === i && (
                      <div className="absolute -top-6 left-0 w-full text-center text-sm text-blue-600 font-semibold">
                        i
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Array 2 */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-sm font-semibold text-gray-500">Array 2</div>
              <div className="flex justify-center gap-1">
                {array2.map((num, idx) => (
                  <div key={`arr2-${idx}`} className="relative">
                    <div
                      className={`
                        w-16 h-16 flex items-center justify-center rounded-lg
                        ${idx === j ? 'ring-2 ring-green-500' : ''}
                        ${comparing.j === idx ? 'bg-green-100' : 'bg-white'}
                        ${idx < j ? 'opacity-50' : ''}
                        ${lastAction === 'array2' && idx === j - 1 ? 'scale-110' : ''}
                        shadow-md text-lg font-bold transition-all duration-300
                      `}
                    >
                      {num}
                    </div>
                    <div className="absolute -bottom-6 left-0 w-full text-center text-sm text-gray-500">
                      {idx}
                    </div>
                    {idx === j && (
                      <div className="absolute -top-6 left-0 w-full text-center text-sm text-green-600 font-semibold">
                        j
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Result Array */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-sm font-semibold text-gray-500">Result Array</div>
              <div className="flex justify-center gap-1 min-h-[4rem]">
                {result.map((num, idx) => (
                  <div key={`result-${idx}`} className="relative">
                    <div
                      className={`
                        w-16 h-16 flex items-center justify-center rounded-lg
                        bg-yellow-50 border-2 border-yellow-500
                        shadow-md text-lg font-bold
                        ${idx === result.length - 1 ? 'scale-110' : ''}
                        transition-all duration-300
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
            </div>
          </div>

          <div className="flex gap-6 justify-center text-sm bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 ring-2 ring-blue-500 rounded"></div>
              <span>Array 1 Pointer (i)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 ring-2 ring-green-500 rounded"></div>
              <span>Array 2 Pointer (j)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-50 border-2 border-yellow-500 rounded"></div>
              <span>Result Array</span>
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

export default MergeSortedAnimation;