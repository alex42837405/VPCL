import React from 'react';
import { MdInfo, MdClose, MdCode } from 'react-icons/md';
import { CODE_TEMPLATES } from '../constants/codeTemplates';
import { PLAN_CATEGORIES } from '../constants/planLibrary';
import styles from '../styles.module.css';

export default function PropertiesPanel({ selectedPlan, plans, language, onUpdatePlan, onRemoveConnection, connections, phase }) {
  if (!selectedPlan) {
    return (
      <div className={styles.propertiesPanel}>
        <div className={styles.panelHeader}>
          <h3>Properties</h3>
        </div>
        <div className={styles.noSelection}>
          <MdInfo size={48} />
          <p>Select a plan to view its properties</p>
        </div>
      </div>
    );
  }

  const getPlanCode = () => {
    const template = CODE_TEMPLATES[language] || CODE_TEMPLATES.c;
    if (selectedPlan.customCode) return selectedPlan.customCode;
    return template[selectedPlan.name] || `// ${selectedPlan.name} code template not available`;
  };

  const category = PLAN_CATEGORIES[selectedPlan.category] || PLAN_CATEGORIES.basic;
  const planConnections = connections.filter(c => c.from === selectedPlan.id || c.to === selectedPlan.id);

  const isEditable = phase === 3;
  const canEditConnections = phase === 2 || phase === 3;
  const canViewCode = phase === 2 || phase === 3;
  const canEditCode = phase === 3;

  return (
    <div className={styles.propertiesPanel}>
      <div className={styles.panelHeader}>
        <div className={styles.planIconSmall} style={{ backgroundColor: `${category.color}20`, color: category.color }}>
          {selectedPlan.icon && <selectedPlan.icon size={18} />}
        </div>
        {isEditable ? (
          <input
            type="text"
            value={selectedPlan.name}
            onChange={(e) => onUpdatePlan(selectedPlan.id, { name: e.target.value })}
            className={styles.panelTitleInput}
          />
        ) : (
          <h3>{selectedPlan.name}</h3>
        )}
      </div>
      
      <div className={styles.panelContent}>
        <div className={styles.propertyGroup}>
          <label>Integration Mode</label>
          {canEditConnections ? (
            <select
              value={selectedPlan.integrationMode || 'appended'}
              onChange={(e) => onUpdatePlan(selectedPlan.id, { integrationMode: e.target.value })}
              className={styles.select}
            >
              <option value="appended">Appended (Sequential)</option>
              <option value="interleaved">Interleaved (Alternating)</option>
              <option value="branched">Branched (Conditional)</option>
              <option value="embedded">Embedded (Nested)</option>
            </select>
          ) : (
            <div className={styles.readOnlyValue}>
              {selectedPlan.integrationMode || 'appended'}
            </div>
          )}
        </div>

        <div className={styles.propertyGroup}>
          <label>Parent Plan (Container)</label>
          {canEditConnections ? (
            <select
              value={selectedPlan.parentId || ''}
              onChange={(e) => onUpdatePlan(selectedPlan.id, { parentId: e.target.value || null })}
              className={styles.select}
            >
              <option value="">None (Root Level)</option>
              {plans.filter(p => p.id !== selectedPlan.id && p.type === 'control').map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          ) : (
            <div className={styles.readOnlyValue}>
              {selectedPlan.parentId ? plans.find(p => p.id === selectedPlan.parentId)?.name || 'Unknown' : 'None (Root Level)'}
            </div>
          )}
        </div>

        {canViewCode && (
          <div className={styles.propertyGroup}>
            <label>Generated Code ({language.toUpperCase()})</label>
            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <MdCode size={14} />
                <span>{selectedPlan.name}</span>
              </div>
              {canEditCode ? (
                <textarea
                  value={getPlanCode()}
                  onChange={(e) => onUpdatePlan(selectedPlan.id, { customCode: e.target.value })}
                  className={styles.codeTextarea}
                  rows={6}
                />
              ) : (
                <pre className={styles.codeReadOnly}>
                  <code>{getPlanCode()}</code>
                </pre>
              )}
            </div>
          </div>
        )}

        <div className={styles.propertyGroup}>
          <label>Connections ({planConnections.length})</label>
          <div className={styles.connectionsList}>
            {planConnections.map(conn => {
              const otherId = conn.from === selectedPlan.id ? conn.to : conn.from;
              const otherPlan = plans.find(p => p.id === otherId);
              return otherPlan ? (
                <div key={`${conn.from}-${conn.to}`} className={styles.connectionItem}>
                  <span className={styles.connectionMode} style={{ backgroundColor: getConnectionColor(conn.mode) }}>
                    {conn.mode}
                  </span>
                  <span className={styles.connectionPlan}>{otherPlan.name}</span>
                  {canEditConnections && (
                    <button className={styles.removeBtn} onClick={() => onRemoveConnection(conn.from, conn.to)}>
                      <MdClose size={12} />
                    </button>
                  )}
                </div>
              ) : null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const getConnectionColor = (mode) => {
  switch(mode) {
    case 'appended': return '#22c55e';
    case 'interleaved': return '#eab308';
    case 'branched': return '#3b82f6';
    case 'embedded': return '#a855f7';
    default: return '#6b7280';
  }
};