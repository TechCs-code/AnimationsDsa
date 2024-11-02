import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, RotateCcw, SkipForward } from 'lucide-react';

const LongestSubstringAnimation = () => {
  const [string] = useState("abcabcbb");
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [charSet, setCharSet] = useState(new Set());
  const [maxLength, setMaxLength] = useState(0);
  const [currentLine, setCurrentLine] = useState(1);
  const [algorithmStep, setAlgorithmStep] = useState('initialize');
  const [isComplete, setIsComplete] = useState(false);
  const [maxWindow, setMaxWindow] = useState({ start: 0, end: 0 });
  const [previousAction, setPreviousAction] = useState(null);

  const code = [
    'def longest_unique_substring(s):',
    '    left, right = 0, 0',
    '    char_set = set()',
    '    max_length = 0',
    '    while right < len(s):',
    '        while s[right] in char_set:',
    '            char_set.remove(s[left])',
    '            left += 1',
    '        char_set.add(s[right])',
    '        max_length = max(max_length, right - left + 1)',
    '        right += 1',
    '    return max_length'
  ];

  const getStepExplanation = (step) => {
    switch (step) {
      case 'initialize':
        return {
          title: "Initialization",
          detail: "Initialize pointers and character set",
          visualization: "Setting up left = 0, right = 0, empty character set"
        };
      case 'check_duplicate':
        return {
          title: "Check for Duplicate",
          detail: `Checking if '${string[right]}' is in character set`,
          visualization: `Character set: {${Array.from(charSet).join(', ')}}`
        };
      case 'remove_char':
        return {
          title: "Remove Character",
          detail: `Removing '${string[left]}' from window`,
          visualization: `Shrinking window from left to remove duplicate`
        };
      case 'add_char':
        return {
          title: "Add Character",
          detail: `Adding '${string[right]}' to window`,
          visualization: `Character set: {${Array.from(charSet).join(', ')}}`
        };
      case 'update_max':
        return {
          title: "Update Maximum",
          detail: "Updating maximum length",
          visualization: `Current length: ${right - left + 1}, Max length: ${maxLength}`
        };
      case 'complete':
        return {
          title: "Algorithm Complete",
          detail: "Found longest substring without repeating characters",
          visualization: `Maximum length: ${maxLength} (substring: "${string.slice(maxWindow.start, maxWindow.end + 1)}")`
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
    setCharSet(new Set());
    setMaxLength(0);
    setCurrentLine(1);
    setAlgorithmStep('initialize');
    setIsComplete(false);
    setMaxWindow({ start: 0, end: 0 });
    setPreviousAction(null);
  };

  const nextStep = () => {
    if (isComplete) return;

    switch (algorithmStep) {
      case 'initialize':
        setCurrentLine(2);
        setAlgorithmStep('check_duplicate');
        break;

      case 'check_duplicate':
        if (charSet.has(string[right])) {
          setCurrentLine(6);
          setAlgorithmStep('remove_char');
        } else {
          setCurrentLine(9);
          setAlgorithmStep('add_char');
        }
        break;

      case 'remove_char':
        setCharSet(prev => {
          const newSet = new Set(prev);
          newSet.delete(string[left]);
          return newSet;
        });
        setLeft(prev => prev + 1);
        setCurrentLine(7);
        setPreviousAction('remove');
        setAlgorithmStep('check_duplicate');
        break;

      case 'add_char':
        setCharSet(prev => {
          const newSet = new Set(prev);
          newSet.add(string[right]);
          return newSet;
        });
        setCurrentLine(10);
        setPreviousAction('add');
        setAlgorithmStep('update_max');
        break;

      case 'update_max':
        const currentLength = right - left + 1;
        if (currentLength > maxLength) {
          setMaxLength(currentLength);
          setMaxWindow({ start: left, end: right });
        }
        if (right + 1 >= string.length) {
          setCurrentLine(12);
          setAlgorithmStep('complete');
          setIsComplete(true);
        } else {
          setRight(prev => prev + 1);
          setCurrentLine(5);
          setAlgorithmStep('check_duplicate');
        }
        break;
    }
  };

  const stepExplanation = getStepExplanation(algorithmStep);

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <CardTitle>Longest Substring Without Repeating Characters</CardTitle>
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
              {string.split('').map((char, idx) => (
                <div key={idx} className="relative">
                  <div
                    className={`
                      w-16 h-16 flex items-center justify-center rounded-lg
                      ${idx >= left && idx <= right ? 'bg-blue-100 border-2 border-blue-500' : 'bg-white border border-gray-300'}
                      ${charSet.has(char) ? 'ring-2 ring-green-400' : ''}
                      ${(maxWindow.start <= idx && idx <= maxWindow.end && isComplete) ? 'ring-2 ring-yellow-400' : ''}
                      ${previousAction === 'remove' && idx === left - 1 ? 'bg-red-100' : ''}
                      ${previousAction === 'add' && idx === right ? 'bg-green-100' : ''}
                      shadow-md text-lg font-bold transition-all duration-300
                    `}
                  >
                    {char}
                  </div>
                  <div className="absolute -bottom-6 left-0 w-full text-center text-sm text-gray-500">
                    {idx}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-center gap-8">
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Current Length</div>
                <div className="text-xl font-bold">{right - left + 1}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Max Length</div>
                <div className="text-xl font-bold">{maxLength}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Character Set</div>
                <div className="text-xl font-bold font-mono">
                  {`{${Array.from(charSet).join(', ')}}`}
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
              <div className="w-4 h-4 bg-white ring-2 ring-green-400 rounded"></div>
              <span>In Character Set</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white ring-2 ring-yellow-400 rounded"></div>
              <span>Longest Substring</span>
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

export default LongestSubstringAnimation;