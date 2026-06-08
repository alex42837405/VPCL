import { useState, useCallback, useRef } from 'react';

export function useUndoRedo() {
  const [history, setHistory] = useState([]);
  const [index, setIndex] = useState(-1);
  const isUndoRedo = useRef(false);

  const push = useCallback((plans, connections) => {
    if (isUndoRedo.current) return;
    
    const newState = {
      plans: JSON.parse(JSON.stringify(plans)),
      connections: JSON.parse(JSON.stringify(connections)),
    };
    
    setHistory(prev => {
      const newHistory = prev.slice(0, index + 1);
      newHistory.push(newState);
      if (newHistory.length > 50) newHistory.shift();
      return newHistory;
    });
    setIndex(prev => {
      let newIndex = prev + 1;
      if (newIndex >= 50) newIndex = 49;
      return newIndex;
    });
  }, [index]);

  const undo = useCallback(() => {
    if (index > 0 && !isUndoRedo.current) {
      isUndoRedo.current = true;
      const newIndex = index - 1;
      setIndex(newIndex);
      const state = history[newIndex];
      setTimeout(() => { isUndoRedo.current = false; }, 100);
      return state;
    }
    return null;
  }, [history, index]);

  const redo = useCallback(() => {
    if (index < history.length - 1 && !isUndoRedo.current) {
      isUndoRedo.current = true;
      const newIndex = index + 1;
      setIndex(newIndex);
      const state = history[newIndex];
      setTimeout(() => { isUndoRedo.current = false; }, 100);
      return state;
    }
    return null;
  }, [history, index]);

  const canUndo = index > 0;
  const canRedo = index < history.length - 1 && history.length > 0;
  const historyIndex = index;
  const historyLength = history.length;

  return { push, undo, redo, canUndo, canRedo, historyIndex, historyLength };
}