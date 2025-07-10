import React from "react";
import WhatSparkDoesBox from "../../about/WhatSparkDoesBox";
import HowToUseSparkBox from "../../about/HowToUseSparkBox";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

const LearnMore = () => {
  const [activeTab, setActiveTab] = React.useState<'what' | 'how'>("what");
  return (
    <div className="container mx-auto px-4 py-16 min-h-[60vh]">
      <h1 className="text-4xl font-bold mb-8 text-center">Learn More About SPARK</h1>
      <div className="flex justify-center mb-8 gap-4">
        <button
          className={`px-6 py-2 rounded-t-lg font-semibold border-b-2 transition-colors ${activeTab === 'what' ? 'border-primary text-primary bg-primary/10' : 'border-transparent text-muted-foreground bg-transparent'}`}
          onClick={() => setActiveTab('what')}
        >
          What SPARK Does
        </button>
        <button
          className={`px-6 py-2 rounded-t-lg font-semibold border-b-2 transition-colors ${activeTab === 'how' ? 'border-primary text-primary bg-primary/10' : 'border-transparent text-muted-foreground bg-transparent'}`}
          onClick={() => setActiveTab('how')}
        >
          How to use SPARK
        </button>
      </div>
      <Card className="max-w-2xl mx-auto">
        <CardContent className="py-8">
          {activeTab === 'what' ? <WhatSparkDoesBox /> : <HowToUseSparkBox />}
        </CardContent>
      </Card>
    </div>
  );
};

export default LearnMore; 