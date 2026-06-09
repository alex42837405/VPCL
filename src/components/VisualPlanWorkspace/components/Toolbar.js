import React from 'react';
import clsx from 'clsx';
import { MdSave, MdFolderOpen, MdZoomIn, MdZoomOut, MdCenterFocusStrong, MdUndo, MdRedo, MdHelp, MdPlayArrow } from 'react-icons/md';
import { VscNewFile } from 'react-icons/vsc';
import styles from '../styles.module.css';

export default function Toolbar({
  undo,
  redo,
  canUndo,
  canRedo,
  saveWorkspace,
  openWorkspace,
  clearWorkspace,
  phase,
  setPhase,
  language,
  setLanguage,
  loadExample,
  zoomIn,
  zoomOut,
  resetZoom,
  zoom,
  setShowShortcuts,
  onRunExecution,
  showExecution
}) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarGroup}>
        <button className={clsx(styles.toolbarBtn, !canUndo && styles.disabled)} onClick={undo} disabled={!canUndo}>
          <MdUndo size={18} />
        </button>
        <button className={clsx(styles.toolbarBtn, !canRedo && styles.disabled)} onClick={redo} disabled={!canRedo}>
          <MdRedo size={18} />
        </button>
        <div className={styles.divider} />
        <button className={styles.toolbarBtn} onClick={saveWorkspace}>
          <MdSave size={18} />
          <span>Save</span>
        </button>
        <button className={styles.toolbarBtn} onClick={openWorkspace}>
          <MdFolderOpen size={18} />
          <span>Open</span>
        </button>
        <button className={styles.toolbarBtn} onClick={clearWorkspace}>
          <VscNewFile size={18} />
          <span>New</span>
        </button>
      </div>

      <div className={styles.toolbarGroup}>
        <button className={clsx(styles.phaseBtn, phase === 1 && styles.active)} onClick={() => setPhase(1)}>
          <span>Phase 1: Observation</span>
        </button>
        <button className={clsx(styles.phaseBtn, phase === 2 && styles.active)} onClick={() => setPhase(2)}>
          <span>Phase 2: Integration</span>
        </button>
        <button className={clsx(styles.phaseBtn, phase === 3 && styles.active)} onClick={() => setPhase(3)}>
          <span>Phase 3: Creation</span>
        </button>
      </div>

      <div className={styles.toolbarGroup}>
        <select className={styles.select} value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="c">C Language</option>
          <option value="cpp">C++ Language</option>
          <option value="pascal">Pascal Language</option>
        </select>
      </div>

      <div className={styles.toolbarGroup}>
        <select className={styles.select} onChange={(e) => e.target.value && loadExample(e.target.value)} defaultValue="">
          <option value="" disabled>Load Example</option>
          <option value="selectionSort">Selection Sort</option>
          <option value="exchangeSort">Exchange Sort (Bubble)</option>
          <option value="exSelSort">ExSel Sort (Combined)</option>
          <option value="insertionSort">Insertion Sort</option>
        </select>
      </div>

      <div className={styles.toolbarGroup}>
        <button className={styles.iconBtn} onClick={zoomOut}>
          <MdZoomOut size={18} />
        </button>
        <span className={styles.zoomText}>{Math.round(zoom * 100)}%</span>
        <button className={styles.iconBtn} onClick={zoomIn}>
          <MdZoomIn size={18} />
        </button>
        <button className={styles.iconBtn} onClick={resetZoom}>
          <MdCenterFocusStrong size={18} />
        </button>
        <div className={styles.divider} />
        <button 
          className={clsx(styles.toolbarBtn, styles.runBtn, showExecution && styles.active)} 
          onClick={onRunExecution}
          id="run-button"
        >
          <MdPlayArrow size={18} />
          <span>Run</span>
        </button>
        <div className={styles.divider} />
        <button className={styles.iconBtn} onClick={() => setShowShortcuts(true)}>
          <MdHelp size={18} />
        </button>
      </div>
    </div>
  );
}