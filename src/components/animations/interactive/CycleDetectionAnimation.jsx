import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, RotateCcw, SkipForward } from 'lucide-react';

const CycleDetectionAnimation = () => {
  const [nodes] = useState([
    { value: 1, next: 1 },
    { value: 2, next: 2 },
    { value: 3, next: 3 },
    { value: 4, next: 4 },
    { value: 5, next: 5 },
    { value: 6, next: 6 },
    { value: 7, next: 3 }
  ]);
  
  const [slow, setSlow] = useState(0);
  const [fast, setFast] = useState(0);
  const [currentLine, setCurrentLine] = useState(1);
  const [algorithmStep, setAlgorithmStep] = useState('initialize');
  const [isComplete, setIsComplete] = useState(false);
  const [cycleFound, setCycleFound] = useState(false);
  const [visitedNodes, setVisitedNodes] = useState(new Set([0]));
  const [previousPositions, setPreviousPositions] = useState({ slow: null, fast: null });

  const cycleStartIndex = 3;
  const radius = 180;
  const nodeRadius = 40;
  const startX = 150;
  const startY = 200;

  const code = [
    'def detect_cycle(head):',
    '    slow = fast = head',
    '    while fast and fast.next:',
    '        slow = slow.next',
    '        fast = fast.next.next',
    '        if slow == fast:',
    '            return True  # Cycle detected',
    '    return False  # No cycle found'
  ];

  const getNodePosition = (index) => {
    if (index < cycleStartIndex) {
      return {
        x: startX + index * 140,
        y: startY
      };
    } else {
      const nodesInCycle = nodes.length - cycleStartIndex + 1;
      const angle = ((index - cycleStartIndex) / nodesInCycle) * 2 * Math.PI - Math.PI/2;
      return {
        x: startX + (cycleStartIndex - 1) * 140 + radius + radius * Math.cos(angle),
        y: startY + radius * Math.sin(angle)
      };
    }
  };

  const ArrowMarker = () => (
    <defs>
      <marker
        id="arrowhead"
        markerWidth="10"
        markerHeight="7"
        refX="9"
        refY="3.5"
        orient="auto"
      >
        <polygon 
          points="0 0, 10 3.5, 0 7" 
          fill="#666"
        />
      </marker>
    </defs>
  );

  const drawArrow = (start, end) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx);
    
    const startX = start.x + nodeRadius * Math.cos(angle);
    const startY = start.y + nodeRadius * Math.sin(angle);
    const endX = end.x - nodeRadius * Math.cos(angle);
    const endY = end.y - nodeRadius * Math.sin(angle);

    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    const curvature = 0.3;

    const controlPoint = {
      x: midX - curvature * (endY - startY),
      y: midY + curvature * (endX - startX)
    };

    return (
      <path
        d={`M ${startX} ${startY} Q ${controlPoint.x} ${controlPoint.y} ${endX} ${endY}`}
        fill="none"
        stroke={visitedNodes.has(nodes[start.index].next) ? "#666" : "#ddd"}
        strokeWidth="3"
        markerEnd="url(#arrowhead)"
        className="transition-all duration-300"
        strokeDasharray={visitedNodes.has(nodes[start.index].next) ? "none" : "5,5"}
      />
    );
  };

  const getStepExplanation = (step) => {
    switch (step) {
      case 'initialize':
        return {
          title: "Initialization",
          detail: "Setting both slow and fast pointers to the head of the linked list",
          visualization: "Both pointers start at the first node"
        };
      case 'move_pointers':
        return {
          title: "Move Pointers",
          detail: `Slow pointer moves one step, fast pointer moves two steps`,
          visualization: `Slow: Node ${previousPositions.slow + 1} → Node ${slow + 1}, Fast: Node ${previousPositions.fast + 1} → Node ${fast + 1}`
        };
      case 'check_cycle':
        return {
          title: "Check for Cycle",
          detail: slow === fast ? 
            "Pointers have met at the same node!" : 
            "Checking if slow and fast pointers meet",
          visualization: slow === fast ? 
            `Cycle detected! Both pointers at Node ${slow + 1}` : 
            "Pointers at different positions, continuing..."
        };
      case 'complete':
        return {
          title: "Algorithm Complete",
          detail: cycleFound ? 
            "Cycle detected - Floyd's algorithm proves there is a cycle" : 
            "No cycle found - Fast pointer reached end of list",
          visualization: cycleFound ? 
            `Cycle exists: Pointers met at Node ${slow + 1}` : 
            "List is acyclic (no cycle present)"
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
    setSlow(0);
    setFast(0);
    setCurrentLine(1);
    setAlgorithmStep('initialize');
    setIsComplete(false);
    setCycleFound(false);
    setVisitedNodes(new Set([0]));
    setPreviousPositions({ slow: null, fast: null });
  };

  const nextStep = () => {
    if (isComplete) return;

    switch (algorithmStep) {
      case 'initialize':
        setCurrentLine(2);
        setAlgorithmStep('move_pointers');
        break;

      case 'move_pointers':
        setPreviousPositions({ slow, fast });
        const nextSlow = nodes[slow].next;
        let nextFast = nodes[fast].next;
        if (nextFast !== null) {
          nextFast = nodes[nextFast].next;
        }
        
        setVisitedNodes(prev => {
          const newSet = new Set(prev);
          newSet.add(nextSlow);
          if (nodes[fast].next !== null) {
            newSet.add(nodes[fast].next);
          }
          if (nextFast !== null) {
            newSet.add(nextFast);
          }
          return newSet;
        });

        setSlow(nextSlow);
        setFast(nextFast !== null ? nextFast : fast);
        setCurrentLine(4);
        setAlgorithmStep('check_cycle');
        break;

      case 'check_cycle':
        if (slow === fast && algorithmStep !== 'initialize') {
          setCycleFound(true);
          setIsComplete(true);
          setCurrentLine(6);
          setAlgorithmStep('complete');
        } else if (fast === null || nodes[fast].next === null) {
          setIsComplete(true);
          setCurrentLine(7);
          setAlgorithmStep('complete');
        } else {
          setCurrentLine(3);
          setAlgorithmStep('move_pointers');
        }
        break;
    }
  };

  const stepExplanation = getStepExplanation(algorithmStep);

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <CardTitle>Floyd's Cycle Detection Algorithm Visualization</CardTitle>
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

          <div className="relative bg-slate-100 rounded-lg overflow-hidden" style={{ height: '600px' }}>
            <svg width="100%" height="100%" viewBox="0 0 1000 600">
              <ArrowMarker />
              
              {nodes.map((node, i) => {
                const start = getNodePosition(i);
                const end = getNodePosition(node.next);
                start.index = i;
                return <g key={`arrow-${i}`}>{drawArrow(start, end)}</g>;
              })}
              
              {nodes.map((node, i) => {
                const pos = getNodePosition(i);
                return (
                  <g key={`node-${i}`} transform={`translate(${pos.x - nodeRadius}, ${pos.y - nodeRadius})`}>
                    <circle
                      cx={nodeRadius + 2}
                      cy={nodeRadius + 2}
                      r={nodeRadius}
                      fill="rgba(0,0,0,0.1)"
                    />
                    <circle
                      cx={nodeRadius}
                      cy={nodeRadius}
                      r={nodeRadius}
                      className={`
                        ${!visitedNodes.has(i) ? 'fill-gray-200' :
                          i === slow && i === fast ? 'fill-purple-500' :
                          i === slow ? 'fill-blue-500' :
                          i === fast ? 'fill-green-500' :
                          'fill-white'}
                        ${cycleFound && (i === slow || i === fast) ? 'stroke-yellow-400 stroke-4' : 'stroke-gray-300'}
                        transition-all duration-300
                      `}
                    />
                    <text
                      x={nodeRadius}
                      y={nodeRadius}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={`
                        text-2xl font-bold
                        ${i === slow || i === fast ? 'fill-white' : 'fill-black'}
                        ${!visitedNodes.has(i) ? 'opacity-50' : ''}
                      `}
                    >
                      {node.value}
                    </text>
                    <text
                      x={nodeRadius}
                      y={nodeRadius * 2 + 20}
                      textAnchor="middle"
                      className="text-sm fill-gray-500"
                    >
                      Node {i + 1}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex gap-6 justify-center text-sm bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span>Slow Pointer</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>Fast Pointer</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              <span>Pointers Meet</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border-2 border-yellow-400 rounded-full"></div>
              <span>Cycle Detection Point</span>
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

export default CycleDetectionAnimation;