import React from 'react';
import { MdClose } from 'react-icons/md';
import styles from '../styles.module.css';

export default function ShortcutsModal({ onClose }) {
  const shortcuts = [
    { keys: ['Ctrl', 'Z'], desc: 'Undo last action' },
    { keys: ['Ctrl', 'Y'], desc: 'Redo last action' },
    { keys: ['Ctrl', 'S'], desc: 'Save workspace to .vpcl file' },
    { keys: ['Ctrl', 'O'], desc: 'Open workspace file' },
    { keys: ['Ctrl', '+'], desc: 'Zoom in' },
    { keys: ['Ctrl', '-'], desc: 'Zoom out' },
    { keys: ['Ctrl', '0'], desc: 'Reset zoom' },
    { keys: ['Delete'], desc: 'Delete selected plan' },
    { keys: ['?'], desc: 'Show this menu' },
    { keys: ['Esc'], desc: 'Cancel connection mode' },
    { keys: ['Middle Click / Ctrl+Drag'], desc: 'Pan canvas' },
    { keys: ['Drag Plan'], desc: 'Move plan on canvas' },
  ];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Keyboard Shortcuts</h3>
          <button className={styles.modalClose} onClick={onClose}>
            <MdClose size={20} />
          </button>
        </div>
        <div className={styles.shortcutsList}>
          {shortcuts.map((shortcut, idx) => (
            <div key={idx} className={styles.shortcutRow}>
              <div className={styles.shortcutKeys}>
                {shortcut.keys.map((key, i) => (
                  <React.Fragment key={i}>
                    <kbd>{key}</kbd>
                    {i < shortcut.keys.length - 1 && <span>+</span>}
                  </React.Fragment>
                ))}
              </div>
              <span className={styles.shortcutDesc}>{shortcut.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}