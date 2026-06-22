import React, { useEffect, useState } from 'react';
import styles from '../styles.module.css';

export default function DataVisualization({ data, step, algorithm, onClose }) {
  const [animValue, setAnimValue] = useState(null);
  const [animPhase, setAnimPhase] = useState(null);

  useEffect(() => {
    if (step) {
      if (step.type === 'swap' || step.type === 'SWAP_END' || step.type === 'EXCHANGE_SWAP' || step.type === 'swap_start' || step.type === 'swap_end') {
        setAnimPhase('swapping');
        setAnimValue({ from: step.swapFrom, to: step.swapTo });
        setTimeout(() => setAnimPhase(null), 500);
      } else if (step.type === 'compare' || step.type === 'NEW_SMALLEST' || step.type === 'SELECTION_NEW_MIN' || step.type === 'new_smallest') {
        setAnimPhase('highlight');
        setAnimValue(step.smallestIndex);
        setTimeout(() => setAnimPhase(null), 300);
      } else if (step.type === 'insert') {
        setAnimPhase('highlight');
        setAnimValue(step.insertIndex);
        setTimeout(() => setAnimPhase(null), 300);
      }
    }
  }, [step]);

  const getBoxClass = (idx) => {
    let className = styles.dataBox;
    
    if (data && data.sortedIndices && data.sortedIndices.includes(idx)) {
      className += ' ' + styles.sortedBox;
    }
    if (data && data.currentPass === idx) {
      className += ' ' + styles.passBox;
    }
    if (data && data.smallestIndex === idx) {
      className += ' ' + styles.smallestBox;
    }
    if (data && data.scanIndex === idx) {
      className += ' ' + styles.scanBox;
    }
    if (data && data.insertIndex === idx) {
      className += ' ' + styles.insertBox;
    }
    if (animPhase === 'swapping' && animValue && (animValue.from === idx || animValue.to === idx)) {
      className += ' ' + styles.swappingBox;
    }
    if (animPhase === 'highlight' && animValue === idx) {
      className += ' ' + styles.highlightBox;
    }
    
    return className;
  };

  const getIndicator = (type, idx) => {
    if (type === 'pass' && data && data.currentPass === idx) {
      return <div className={styles.passIndicator}>P</div>;
    }
    if (type === 'smallest' && data && data.smallestIndex === idx) {
      return <div className={styles.smallestIndicator}>S</div>;
    }
    if (type === 'scan' && data && data.scanIndex === idx) {
      return <div className={styles.scanIndicator}>Scan</div>;
    }
    return null;
  };

  if (!data || !data.array) {
    return (
      <div className={styles.dataVisualization}>
        <div className={styles.dataVizContent}>
          <div className={styles.noDataMessage}>Click Go or Step to start execution</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dataVisualization}>
      <div className={styles.dataVizContent}>
        <div className={styles.dataVizStats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Comparisons:</span>
            <span className={styles.statValue}>{data.comparisons || 0}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Swaps:</span>
            <span className={styles.statValue}>{data.swaps || 0}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Current Pass:</span>
            <span className={styles.statValue}>{data.currentPass + 1 || 1}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Array Size:</span>
            <span className={styles.statValue}>{data.array.length || 0}</span>
          </div>
        </div>
        
        <div className={styles.dataBoxContainer}>
          <div className={styles.dataBoxes}>
            {data.array.map((val, idx) => (
              <div key={idx} className={getBoxClass(idx)}>
                <div className={styles.dataBoxValue}>{val}</div>
                <div className={styles.dataBoxIndex}>{idx}</div>
                <div className={styles.dataIndicators}>
                  {getIndicator('pass', idx)}
                  {getIndicator('smallest', idx)}
                  {getIndicator('scan', idx)}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: '#4caf50' }}></div>
            <span>Sorted</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: '#ff9800' }}></div>
            <span>Pass (P)</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: '#f44336' }}></div>
            <span>Smallest (S)</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: '#2196f3' }}></div>
            <span>Scan</span>
          </div>
        </div>
        
        {step && (
          <div className={styles.stepMessage}>
            <span className={styles.messageText}>{step.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}