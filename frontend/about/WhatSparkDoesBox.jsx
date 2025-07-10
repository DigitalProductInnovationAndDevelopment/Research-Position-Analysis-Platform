import React from "react";

const WhatSparkDoesBox = () => {
  return (
    <div className="p-0">
      <h2 className="text-2xl font-bold mb-4">What SPARK Does:</h2>
      <p className="mb-2">
        SPARK (Siemens Publications and Research Knowledgebase) is a web-based analytics
        platform designed to automate and accelerate literature reviews.
      </p>
      <p className="mb-2">By integrating structured and unstructured publication data, SPARK:</p>
      <ol className="list-decimal list-inside space-y-2">
        <li>
          <strong>Identifies Institutional Outputs</strong> – Filters and tags publications by author affiliation to highlight Siemens-relevant research.
        </li>
        <li>
          <strong>Analyzes Trend Dynamics</strong> – Generates time-series charts of keyword popularity and research activity over time.
        </li>
        <li>
          <strong>Maps Collaborations</strong> – Builds and visualizes co-authorship networks to reveal top university and industry partners.
        </li>
        <li>
          <strong>Benchmarks Performance</strong> – Compares your institution's contributions and citation metrics against peers.
        </li>
        <li>
          <strong>Reports Impact</strong> – Displays patent citation rates and funding distributions as clear KPI cards.
        </li>
      </ol>
    </div>
  );
};

export default WhatSparkDoesBox; 