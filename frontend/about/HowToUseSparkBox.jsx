import React from "react";

const HowToUseSparkBox = () => {
  return (
    <div className="p-0">
      <h2 className="text-2xl font-bold mb-4">How to use SPARK:</h2>
      <ol className="list-decimal list-inside space-y-2 mb-4">
        <li>Search: Enter a keyword or institution in the search bar.</li>
        <li>Filter: Refine results by year, keyword, or affiliation using the filter panel.</li>
        <li>Visualize: Explore charts and graphs for trends, collaborations, and benchmarks.</li>
        <li>Export: Download your filtered data and visualizations as CSV or JSON for offline analysis.</li>
      </ol>
      <h3 className="text-lg font-semibold mb-2 text-muted-foreground">Data Source & what to expect:</h3>
      <ul className="list-disc list-inside space-y-1 mb-4">
        <li>Primary API: OpenAlex – Delivers rich, up-to-date publication metadata via RESTful queries.</li>
        <li>Fallback Sources: IEEE Xplore, ACM Digital Library, and Google Scholar scraping as needed.</li>
      </ul>
      <p className="text-sm text-muted-foreground">
        Results are indicative of publicly available research outputs. While SPARK performs name-normalization and affiliation matching with high accuracy, some variations in author metadata may occur. For critical decisions, please cross-verify with original publication records
      </p>
    </div>
  );
};

export default HowToUseSparkBox; 