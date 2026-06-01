import React from 'react';
import { PLAN_LIBRARY, PLAN_CATEGORIES } from '../constants/planLibrary';
import styles from '../styles.module.css';

export default function PlanLibrary({ phase }) {
  const handleDragStart = (e, plan) => {
    if (phase !== 2 && phase !== 3) {
      e.preventDefault();
      return false;
    }
    const dragData = {
      id: plan.id,
      name: plan.name,
      type: plan.type,
      category: plan.category,
      description: plan.description,
      iconName: plan.icon.name
    };
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const plansByCategory = {};
  PLAN_LIBRARY.forEach(plan => {
    if (!plansByCategory[plan.category]) {
      plansByCategory[plan.category] = [];
    }
    plansByCategory[plan.category].push(plan);
  });

  return (
    <div className={styles.planLibrary}>
      <div className={styles.libraryHeader}>
        <h3>Plan Library</h3>
      </div>

      <div className={styles.plansList}>
        {Object.entries(PLAN_CATEGORIES).map(([categoryId, category]) => {
          const plans = plansByCategory[categoryId] || [];
          if (plans.length === 0) return null;
          
          return (
            <div key={categoryId} className={styles.categorySection}>
              <div className={styles.categoryHeader}>
                <span className={styles.categoryName}>{category.name}</span>
              </div>
              
              <div className={styles.categoryPlans}>
                {plans.map(plan => {
                  const IconComp = plan.icon;
                  return (
                    <div
                      key={plan.id}
                      className={styles.planItem}
                      draggable={phase !== 1}
                      onDragStart={(e) => handleDragStart(e, plan)}
                      style={{ opacity: phase === 1 ? 0.5 : 1, cursor: phase === 1 ? 'default' : 'grab' }}
                    >
                      <div className={styles.planIcon} style={{ backgroundColor: `${category.color}20`, color: category.color }}>
                        <IconComp size={20} />
                      </div>
                      <div className={styles.planInfo}>
                        <div className={styles.planName}>{plan.name}</div>
                        <div className={styles.planDescription}>{plan.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}