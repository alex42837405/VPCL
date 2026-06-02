import React, { useState, useRef } from 'react';
import PlanCard from './PlanCard';
import ConnectionLines from './ConnectionLines';
import styles from '../styles.module.css';

export default function Canvas({
  plans,
  connections,
  selectedPlanId,
  connectMode,
  zoom,
  pan,
  setPan,
  onSelectPlan,
  onRemovePlan,
  onUpdatePlanPosition,
  onConnectStart,
  onConnectCancel,
  onConnectTarget,
  onAddPlan,
  onDragEnd,
  phase,
}) {
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [draggingPlan, setDraggingPlan] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragPlanStart, setDragPlanStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  const handleMouseDown = (e) => {
    const target = e.target;
    const isCanvasBg = target === canvasRef.current || 
                       target.classList?.contains(styles.canvas) || 
                       target.classList?.contains(styles.canvasContent) ||
                       target.tagName === 'svg' ||
                       target.tagName === 'rect' ||
                       target.tagName === 'pattern';
    
    if (isCanvasBg && e.ctrlKey) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      const newPanX = e.clientX - panStart.x;
      const newPanY = e.clientY - panStart.y;
      setPan({ x: newPanX, y: newPanY });
    }
    
    if (draggingPlan) {
      const dx = (e.clientX - dragStart.x) / zoom;
      const dy = (e.clientY - dragStart.y) / zoom;
      onUpdatePlanPosition(draggingPlan.id, dragPlanStart.x + dx, dragPlanStart.y + dy);
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    if (draggingPlan && onDragEnd) {
      onDragEnd();
    }
    setDraggingPlan(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    try {
      const planData = JSON.parse(e.dataTransfer.getData('application/json'));
      const fullPlan = {
        ...planData,
        x: x,
        y: y,
        customCode: '',
        integrationMode: 'appended',
      };
      onAddPlan(fullPlan, x, y);
    } catch (err) {
      console.error('Drop error:', err);
    }
  };

  const startDragPlan = (e, plan) => {
    if (phase === 1) return;
    e.stopPropagation();
    e.preventDefault();
    setDraggingPlan(plan);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragPlanStart({ x: plan.x, y: plan.y });
  };

  return (
    <div
      ref={canvasRef}
      className={styles.canvas}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ cursor: isPanning ? 'grabbing' : draggingPlan ? 'grabbing' : 'default' }}
    >
      <div
        className={styles.canvasContent}
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      >
        <svg className={styles.gridLayer} width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
            </pattern>
            <pattern id="gridLarge" width="200" height="200" patternUnits="userSpaceOnUse">
              <rect width="200" height="200" fill="url(#grid)" />
              <path d="M 200 0 L 0 0 0 200" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gridLarge)" />
        </svg>

        <ConnectionLines connections={connections} plans={plans} />
        
        {plans.map(plan => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isSelected={selectedPlanId === plan.id}
            isConnecting={connectMode === plan.id}
            connectMode={connectMode}
            onSelect={() => onSelectPlan(plan.id)}
            onRemove={() => onRemovePlan(plan.id)}
            onMouseDown={(e) => startDragPlan(e, plan)}
            onConnectStart={() => onConnectStart(plan.id)}
            onConnectCancel={onConnectCancel}
            onConnectTarget={() => onConnectTarget(plan.id)}
          />
        ))}
      </div>
    </div>
  );
}