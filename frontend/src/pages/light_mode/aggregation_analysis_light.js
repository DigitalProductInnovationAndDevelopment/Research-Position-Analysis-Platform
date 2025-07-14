import React from "react";
import styles from "../../assets/styles/aggregation.module.css";
import filter from "../../assets/icons/filter.svg";
import sort from "../../assets/icons/sort.svg";
import graphImage from "../../assets/images/graph.jpg";
import TopBar from "../../components/shared/TopBar";

export const AggregationAnalysisLight = () => {
  return (
    <div style={{ background: '#f5f6fa', minHeight: '100vh' }}>
      <TopBar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <h1 style={{ color: '#4F6AF6', fontWeight: 700, fontSize: '2.5rem', marginBottom: 0, lineHeight: 1.1 }}>Collaboration Network</h1>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <img style={{ height: 24 }} alt="Sort icon" src={sort} />
              <span style={{ color: '#555', fontWeight: 500 }}>Sort</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <img style={{ height: 24 }} alt="Filter icon" src={filter} />
              <span style={{ color: '#555', fontWeight: 500 }}>Filter</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img style={{ maxWidth: '100%', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }} alt="Collaboration Network Graph" src={graphImage} />
        </div>
      </div>
    </div>
  );
};

