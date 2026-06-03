export const getConnectionStyle = (mode) => {
  switch(mode) {
    case 'appended': return { stroke: '#22c55e', strokeDasharray: 'none', strokeWidth: 2 };
    case 'interleaved': return { stroke: '#eab308', strokeDasharray: '8 4', strokeWidth: 2 };
    case 'branched': return { stroke: '#3b82f6', strokeDasharray: '4 4', strokeWidth: 2 };
    case 'embedded': return { stroke: '#a855f7', strokeDasharray: '2 6', strokeWidth: 2 };
    default: return { stroke: '#6b7280', strokeDasharray: 'none', strokeWidth: 2 };
  }
};

export const calculateConnectionPath = (fromX, fromY, toX, toY) => {
  const midX = (fromX + toX) / 2;
  return `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`;
};