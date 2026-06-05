export const saveWorkspaceToFile = (plans, connections, addNotification) => {
  const workspace = { 
    plans: plans.map(p => ({ 
      id: p.id,
      name: p.name,
      type: p.type,
      category: p.category,
      description: p.description,
      x: p.x,
      y: p.y,
      customCode: p.customCode,
      integrationMode: p.integrationMode,
      parentId: p.parentId
    })), 
    connections, 
    version: '1.0',
    exportedAt: new Date().toISOString()
  };
  const dataStr = JSON.stringify(workspace, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `vpcl-workspace-${Date.now()}.vpcl`;
  link.click();
  URL.revokeObjectURL(url);
  if (addNotification) addNotification('Workspace saved successfully', 'success');
};