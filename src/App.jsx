import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your gif components
import OppositeDirectionalGif from '@/components/animations/gifs/OppositeDirectionalGif';
import ParallelGif from '@/components/animations/gifs/ParallelGif';
import PartitionGif from '@/components/animations/gifs/PartitionGif';
import SameDirectionalGif from '@/components/animations/gifs/SameDirectionalGif';
import SlidingWindowGif from '@/components/animations/gifs/SlidingWindowGif';

// Import your interactive animation components
import CycleDetectionAnimation from '@/components/animations/interactive/CycleDetectionAnimation';
import LongestSubstringAnimation from '@/components/animations/interactive/LongestSubstringAnimation';
import MaxAverageAnimation from '@/components/animations/interactive/MaxAverageAnimation';
import MergeSortedAnimation from '@/components/animations/interactive/MergeSortedAnimation';
import SortColorsAnimation from '@/components/animations/interactive/SortColorsAnimation';
import TwoSumAnimation from '@/components/animations/interactive/TwoSumAnimation';

function App() {
    return (
        <Router basename="/AnimationsDsa">
            <div className="App">
                <Routes>
                    {/* Routes for gif animations */}
                    <Route path="/" element={
                                            <div className="h-screen w-full flex items-center justify-center">
                                                <h1 className="text-6xl font-bold">hii</h1>
                                            </div>
                                            } 
                    />
                    <Route path="/opposite-directional-gif" element={<OppositeDirectionalGif />} />
                    <Route path="/parallel-gif" element={<ParallelGif />} />
                    <Route path="/partition-gif" element={<PartitionGif />} />
                    <Route path="/same-directional-gif" element={<SameDirectionalGif />} />
                    <Route path="/sliding-window-gif" element={<SlidingWindowGif />} />

                    {/* Routes for interactive animations */}
                    <Route path="/cycle-detection-animation" element={<CycleDetectionAnimation />} />
                    <Route path="/longest-substring-animation" element={<LongestSubstringAnimation />} />
                    <Route path="/max-average-animation" element={<MaxAverageAnimation />} />
                    <Route path="/merge-sorted-animation" element={<MergeSortedAnimation />} />
                    <Route path="/sort-colors-animation" element={<SortColorsAnimation />} />
                    <Route path="/two-sum-animation" element={<TwoSumAnimation />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
