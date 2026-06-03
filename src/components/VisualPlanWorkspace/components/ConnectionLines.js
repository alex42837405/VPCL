import React from 'react';
import { getConnectionStyle, calculateConnectionPath } from '../utils/connectionUtils';
import styles from '../styles.module.css';

export default function ConnectionLines({ connections, plans }) {
  if (!connections || !plans) return null;
  
  return (
    <svg className={styles.svgLayer}>
      {connections.map((conn, idx) => {
        const fromPlan = plans.find(p => p.id === conn.from);
        const toPlan = plans.find(p => p.id === conn.to);
        if (!fromPlan || !toPlan) return null;
        
        const fromX = fromPlan.x + 110;
        const fromY = fromPlan.y + 50;
        const toX = toPlan.x;
        const toY = toPlan.y + 50;
        const path = calculateConnectionPath(fromX, fromY, toX, toY);
        const style = getConnectionStyle(conn.mode);
        
        const modeLabels = {
          appended: 'Appended',
          interleaved: 'Interleaved',
          branched: 'Branched',
          embedded: 'Embedded',
        };
        
        return (
          <g key={idx}>
            <path d={path} fill="none" {...style} />
            <polygon points={`${toX-10},${toY-5} ${toX},${toY} ${toX-10},${toY+5}`} fill={style.stroke} />
          </g>
        );
      })}
    </svg>
  );
}