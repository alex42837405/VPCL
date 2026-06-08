import React from 'react';
import styles from '../styles.module.css';

export default function StatusBar({ phase, phaseName, language, planCount, connectionCount, canUndo, canRedo, historyIndex, historyLength }) {
  return (
    <div className={styles.statusBar}>
      <div className={styles.statusGroup}>
        <span className={styles.statusText}>{phaseName}</span>
      </div>

      <div className={styles.statusDivider} />

      <div className={styles.statusGroup}>
        <span className={styles.statusLabel}>Language:</span>
        <span className={styles.statusValue}>{language}</span>
      </div>

      <div className={styles.statusDivider} />

      <div className={styles.statusGroup}>
        <span className={styles.statusLabel}>History:</span>
        <span className={styles.statusValue}>{historyIndex + 1}/{historyLength}</span>
      </div>
    </div>
  );
}