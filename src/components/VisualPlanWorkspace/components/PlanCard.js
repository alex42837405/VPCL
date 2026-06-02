import React from 'react';
import clsx from 'clsx';
import { FaTrashAlt } from 'react-icons/fa';
import { PLAN_CATEGORIES } from '../constants/planLibrary';
import styles from '../styles.module.css';

export default function PlanCard({
  plan,
  isSelected,
  isConnecting,
  connectMode,
  onSelect,
  onRemove,
  onMouseDown,
  onConnectStart,
  onConnectCancel,
  onConnectTarget,
}) {
  const IconComp = plan.icon;
  const category = PLAN_CATEGORIES[plan.category] || PLAN_CATEGORIES.basic;
  
  const showConnectHere = connectMode && connectMode !== plan.id;
  
  return (
    <div
      className={clsx(styles.planCard, isSelected && styles.selected, isConnecting && styles.connecting)}
      style={{ left: plan.x, top: plan.y, position: 'absolute' }}
      onClick={onSelect}
      onMouseDown={onMouseDown}
    >
      <div className={styles.planHeader}>
        <div className={styles.planIconSmall} style={{ backgroundColor: `${category?.color}20`, color: category?.color }}>
          {IconComp ? <IconComp size={20} /> : <div className={styles.placeholderIcon} />}
        </div>
        <div className={styles.planName}>{plan.name}</div>
        <button className={styles.planDelete} onClick={(e) => { e.stopPropagation(); onRemove(); }}>
          <FaTrashAlt size={12} />
        </button>
      </div>
      <div className={styles.planType} style={{ color: category?.color }}>
        {plan.type}
      </div>
      <div className={styles.planDesc}>{plan.description}</div>
      <div className={styles.planActions}>
        {!isConnecting && onConnectStart && (
          <button className={styles.connectBtn} onClick={(e) => { e.stopPropagation(); onConnectStart(); }}>
            Connect
          </button>
        )}
        {isConnecting && onConnectCancel && (
          <button className={styles.cancelBtn} onClick={(e) => { e.stopPropagation(); onConnectCancel(); }}>
            Cancel
          </button>
        )}
        {showConnectHere && onConnectTarget && (
          <button className={styles.connectTargetBtn} onClick={(e) => { e.stopPropagation(); onConnectTarget(); }}>
            Connect Here
          </button>
        )}
      </div>
    </div>
  );
}