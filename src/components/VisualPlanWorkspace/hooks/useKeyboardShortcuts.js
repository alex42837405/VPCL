import { useEffect } from 'react';

export function useKeyboardShortcuts({
  undo,
  redo,
  saveWorkspace,
  openWorkspace,
  zoomIn,
  zoomOut,
  resetZoom,
  deleteSelected,
  selectedPlanId,
  setShowShortcuts,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') { e.preventDefault(); undo(); }
        if (e.key === 'y') { e.preventDefault(); redo(); }
        if (e.key === 's') { e.preventDefault(); saveWorkspace(); }
        if (e.key === 'o') { e.preventDefault(); openWorkspace(); }
        if (e.key === '+') { e.preventDefault(); zoomIn(); }
        if (e.key === '-') { e.preventDefault(); zoomOut(); }
        if (e.key === '0') { e.preventDefault(); resetZoom(); }
      }
      if (e.key === 'Delete' && selectedPlanId) { deleteSelected(); }
      if (e.key === '?') { setShowShortcuts(true); }
      if (e.key === 'Escape') { setShowShortcuts(false); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, saveWorkspace, openWorkspace, zoomIn, zoomOut, resetZoom, deleteSelected, selectedPlanId, setShowShortcuts]);
}