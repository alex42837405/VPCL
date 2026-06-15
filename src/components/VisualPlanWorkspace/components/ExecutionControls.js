import React, { useState } from 'react';
import { MdPlayArrow, MdPause, MdReplay, MdSpeed } from 'react-icons/md';
import styles from '../styles.module.css';

export default function ExecutionControls({ 
  engine, 
  isRunning, 
  isPaused,
  onStep, 
  onReset,
  onSpeedChange,
  algorithm
}) {
  const [speed, setSpeed] = useState(1);

  const handleSpeedChange = (e) => {
    const newSpeed = parseFloat(e.target.value);
    setSpeed(newSpeed);
    if (onSpeedChange) onSpeedChange(newSpeed);
  };

  const algorithmNames = {
    selectionSort: 'Selection Sort',
    exchangeSort: 'Exchange Sort',
    exSelSort: 'ExSel Sort',
    insertionSort: 'Insertion Sort',
    custom: 'Custom Composition'
  };

  return (
    <div className={styles.executionControls}>
      <div className={styles.controlsGroup}>
        <button 
          className={styles.controlBtn}
          onClick={() => engine && engine.start ? engine.start() : null}
          disabled={isRunning && !isPaused}
        >
          <MdPlayArrow size={18} />
          <span>Go</span>
        </button>
        
        <button 
          className={styles.controlBtn}
          onClick={() => engine && engine.pause ? engine.pause() : null}
          disabled={!isRunning || isPaused}
        >
          <MdPause size={18} />
          <span>Pause</span>
        </button>
        
        <button 
          className={styles.controlBtn}
          onClick={onStep}
          disabled={isRunning && !isPaused}
        >
          <span>Step</span>
        </button>
        
        <button 
          className={styles.controlBtn}
          onClick={onReset}
        >
          <MdReplay size={18} />
          <span>Reset</span>
        </button>
      </div>
      
      <div className={styles.controlsGroup}>
        <div className={styles.speedControl}>
          <MdSpeed size={18} />
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={speed}
            onChange={handleSpeedChange}
            className={styles.speedSlider}
          />
          <span className={styles.speedValue}>{speed}x</span>
        </div>
      </div>
      
      <div className={styles.controlsGroup}>
        <div className={styles.algorithmDisplay}>
          <span className={styles.algorithmLabel}>Algorithm:</span>
          <span className={styles.algorithmValue}>{algorithmNames[algorithm] || algorithm}</span>
        </div>
      </div>
    </div>
  );
}