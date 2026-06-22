import React from 'react';
import { MdClose, MdArrowForward, MdSkipNext } from 'react-icons/md';
import styles from '../styles.module.css';

export default function TutorialPanel({ step, currentStep, totalSteps, onNext, onSkip }) {
  const getTargetPosition = (targetId) => {
    if (!targetId) return { top: '20%', left: '20%' };
    const element = document.getElementById(targetId);
    if (element) {
      const rect = element.getBoundingClientRect();
      return { top: rect.top + rect.height + 10, left: rect.left };
    }
    return { top: '20%', left: '20%' };
  };

  const position = getTargetPosition(step.target);

  return (
    <div className={styles.tutorialOverlay}>
      <div 
        className={styles.tutorialCard}
        style={{ top: position.top, left: position.left, position: 'fixed' }}
      >
        <div className={styles.tutorialHeader}>
          <div className={styles.tutorialStep}>Step {currentStep + 1} of {totalSteps}</div>
          <button className={styles.tutorialClose} onClick={onSkip}>
            <MdClose size={18} />
          </button>
        </div>
        <h4 className={styles.tutorialTitle}>{step.title}</h4>
        <p className={styles.tutorialContent}>{step.content}</p>
        <div className={styles.tutorialActions}>
          <button className={styles.tutorialSkip} onClick={onSkip}>
            <MdSkipNext size={16} /> Skip Tutorial
          </button>
          <button className={styles.tutorialNext} onClick={onNext}>
            {currentStep === totalSteps - 1 ? 'Finish' : 'Next'} <MdArrowForward size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}