import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, AppBar, Toolbar, IconButton, Button, Select, MenuItem, FormControl, Typography, Drawer, Paper, Snackbar, Alert, Dialog, DialogTitle, DialogContent, Chip, ToggleButton, ToggleButtonGroup, ButtonGroup, Slider, Divider, Stack, Tooltip, alpha, TextField, GlobalStyles } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import SaveIcon from '@mui/icons-material/Save';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AddIcon from '@mui/icons-material/Add';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import HelpIcon from '@mui/icons-material/Help';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
import SpeedIcon from '@mui/icons-material/Speed';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CodeIcon from '@mui/icons-material/Code';

import { useUndoRedo } from './hooks/useUndoRedo';
import { useNotifications } from './hooks/useNotifications';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { saveWorkspaceToFile } from './utils/fileUtils';
import { EXAMPLES } from './constants/examples';
import { PLAN_LIBRARY, PLAN_CATEGORIES } from './constants/planLibrary';
import { ExecutionEngine } from './runtime/ExecutionEngine';
import { ReasoningService } from './services/ReasoningService';
import { getConnectionStyle } from './utils/connectionUtils';
import { CODE_TEMPLATES } from './constants/codeTemplates';
import { StyledCanvas, CanvasContent, GridLayer, SvgLayer, PlanCardStyled, PlanLibraryDrawer, PropertiesDrawer, DataBox } from './styles';

const lightThemeColors = {
  primary: '#2e5cb8',
  primaryDark: '#2952a6',
  background: '#ffffff',
  surface: '#f5f5f5',
  text: '#1a1a1a',
  textSecondary: '#4a4a4a',
  border: '#e0e0e0',
};

const darkThemeColors = {
  primary: '#6b9fe8',
  primaryDark: '#4e8be3',
  background: '#1a1a1a',
  surface: '#242424',
  text: '#e0e0e0',
  textSecondary: '#a0a0a0',
  border: '#333333',
};

const getTheme = (mode) => {
  const colors = mode === 'dark' ? darkThemeColors : lightThemeColors;
  return createTheme({
    palette: {
      mode: mode,
      primary: { main: colors.primary },
      background: { default: colors.background, paper: colors.surface },
      text: { primary: colors.text, secondary: colors.textSecondary },
      divider: colors.border,
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      button: { textTransform: 'none', fontWeight: 500 },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: colors.surface,
            backgroundImage: 'none',
            borderBottom: `1px solid ${colors.border}`,
            boxShadow: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: colors.surface,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { fontWeight: 500 },
          contained: {
            backgroundColor: colors.primary,
            '&:hover': { backgroundColor: colors.primaryDark },
          },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            color: colors.text,
            borderColor: colors.border,
            '&.Mui-selected': {
              backgroundColor: colors.primary,
              color: '#ffffff',
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: { color: colors.text },
          notchedOutline: { borderColor: colors.border },
        },
      },
      MuiSelect: {
        styleOverrides: {
          select: { color: colors.text },
          icon: { color: colors.text },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: { color: colors.text },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: { color: colors.text },
          h6: { fontWeight: 600 },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: colors.border },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: { color: colors.text },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { color: colors.text },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: { color: colors.text },
        },
      },
    },
  });
};

let nextId = 500;

function PlanCard({ plan, isSelected, isConnecting, connectMode, onSelect, onRemove, onMouseDown, onConnectStart, onConnectCancel, onConnectTarget }) {
  const category = PLAN_CATEGORIES[plan.category] || PLAN_CATEGORIES.basic;
  const IconComp = plan.icon;
  const showConnectHere = connectMode && connectMode !== plan.id;

  return (
    <PlanCardStyled elevation={2} selected={isSelected} connecting={isConnecting} style={{ left: plan.x, top: plan.y }} onClick={onSelect} onMouseDown={onMouseDown}>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Box sx={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, bgcolor: alpha(category.color, 0.2), color: category.color }}>
          {IconComp ? <IconComp size={20} /> : <Box width={20} height={20} />}
        </Box>
        <Typography variant="body2" fontWeight={600} flex={1}>{plan.name}</Typography>
        <IconButton size="small" onClick={(e) => { e.stopPropagation(); onRemove(); }}><DeleteOutlineIcon fontSize="small" /></IconButton>
      </Box>
      <Typography variant="caption" sx={{ color: category.color, textTransform: 'uppercase', fontWeight: 600, display: 'block', mb: 0.5 }}>{plan.type}</Typography>
      <Typography variant="caption" color="text.secondary" display="block" mb={1}>{plan.description}</Typography>
      <Box display="flex" gap={0.5} mt={1}>
        {!isConnecting && onConnectStart && (<Button size="small" variant="contained" fullWidth onClick={(e) => { e.stopPropagation(); onConnectStart(); }}>Connect</Button>)}
        {isConnecting && onConnectCancel && (<Button size="small" variant="outlined" fullWidth onClick={(e) => { e.stopPropagation(); onConnectCancel(); }}>Cancel</Button>)}
        {showConnectHere && onConnectTarget && (<Button size="small" variant="contained" color="warning" fullWidth onClick={(e) => { e.stopPropagation(); onConnectTarget(); }}>Connect Here</Button>)}
      </Box>
    </PlanCardStyled>
  );
}

function ConnectionLines({ connections, plans }) {
  if (!connections || !plans) return null;
  return (
    <SvgLayer>
      {connections.map((conn, idx) => {
        const fromPlan = plans.find(p => p.id === conn.from);
        const toPlan = plans.find(p => p.id === conn.to);
        if (!fromPlan || !toPlan) return null;
        const fromX = fromPlan.x + 110;
        const fromY = fromPlan.y + 50;
        const toX = toPlan.x;
        const toY = toPlan.y + 50;
        const midX = (fromX + toX) / 2;
        const path = `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`;
        const style = getConnectionStyle(conn.mode);
        return (
          <g key={idx}>
            <path d={path} fill="none" stroke={style.stroke} strokeWidth={style.strokeWidth} strokeDasharray={style.strokeDasharray} />
            <polygon points={`${toX-10},${toY-5} ${toX},${toY} ${toX-10},${toY+5}`} fill={style.stroke} />
          </g>
        );
      })}
    </SvgLayer>
  );
}

function Canvas({ plans, connections, selectedPlanId, connectMode, zoom, pan, setPan, onSelectPlan, onRemovePlan, onUpdatePlanPosition, onConnectStart, onConnectCancel, onConnectTarget, onAddPlan, onDragEnd, phase }) {
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [draggingPlan, setDraggingPlan] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragPlanStart, setDragPlanStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  const handleMouseDown = (e) => {
    const target = e.target;
    const isCanvasBg = target === canvasRef.current || target.classList?.contains('MuiBox-root');
    if (isCanvasBg && e.ctrlKey) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    if (draggingPlan) {
      const dx = (e.clientX - dragStart.x) / zoom;
      const dy = (e.clientY - dragStart.y) / zoom;
      onUpdatePlanPosition(draggingPlan.id, dragPlanStart.x + dx, dragPlanStart.y + dy);
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    if (draggingPlan && onDragEnd) onDragEnd();
    setDraggingPlan(null);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    try {
      const planData = JSON.parse(e.dataTransfer.getData('application/json'));
      onAddPlan({ ...planData, customCode: '', integrationMode: 'appended' }, x, y);
    } catch (err) { console.error('Drop error:', err); }
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
    <StyledCanvas ref={canvasRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onDragOver={handleDragOver} onDrop={handleDrop}>
      <CanvasContent style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
        <GridLayer>
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
        </GridLayer>
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
      </CanvasContent>
    </StyledCanvas>
  );
}

function PlanLibraryComponent({ phase }) {
  const plansByCategory = {};
  PLAN_LIBRARY.forEach(plan => {
    if (!plansByCategory[plan.category]) plansByCategory[plan.category] = [];
    plansByCategory[plan.category].push(plan);
  });

  const handleDragStart = (e, plan) => {
    if (phase !== 2 && phase !== 3) { e.preventDefault(); return false; }
    e.dataTransfer.setData('application/json', JSON.stringify(plan));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}><Typography variant="h6">Plan Library</Typography></Box>
      <Box sx={{ p: 1.5, overflowY: 'auto', flex: 1 }}>
        {Object.entries(PLAN_CATEGORIES).map(([categoryId, category]) => {
          const plans = plansByCategory[categoryId] || [];
          if (plans.length === 0) return null;
          return (
            <Box key={categoryId} sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 600, color: 'text.secondary', display: 'block', mb: 1 }}>{category.name}</Typography>
              <Stack spacing={1}>
                {plans.map(plan => {
                  const IconComp = plan.icon;
                  return (
                    <Paper key={plan.id} draggable={phase !== 1} onDragStart={(e) => handleDragStart(e, plan)} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1, cursor: phase === 1 ? 'default' : 'grab', opacity: phase === 1 ? 0.5 : 1, transition: 'all 0.2s', '&:hover': phase !== 1 && { borderColor: 'primary.main', transform: 'translateX(2px)' }, '&:active': { cursor: 'grabbing' } }} variant="outlined">
                      <Box sx={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1, bgcolor: alpha(category.color, 0.2), color: category.color }}>
                        <IconComp size={20} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight={500}>{plan.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{plan.description}</Typography>
                      </Box>
                    </Paper>
                  );
                })}
              </Stack>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

function PropertiesPanelComponent({ selectedPlan, plans, language, onUpdatePlan, onRemoveConnection, connections, phase }) {
  if (!selectedPlan) {
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}><Typography variant="h6">Properties</Typography></Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4, textAlign: 'center', color: 'text.secondary' }}>
          <LightbulbIcon sx={{ fontSize: 48, mb: 2 }} />
          <Typography>Select a plan to view its properties</Typography>
        </Box>
      </Box>
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

  const getConnectionColor = (mode) => {
    switch(mode) {
      case 'appended': return '#22c55e';
      case 'interleaved': return '#eab308';
      case 'branched': return '#3b82f6';
      case 'embedded': return '#a855f7';
      default: return '#6b7280';
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1, bgcolor: alpha(category.color, 0.2), color: category.color }}>
          {selectedPlan.icon && <selectedPlan.icon size={18} />}
        </Box>
        {isEditable ? (
          <TextField size="small" value={selectedPlan.name} onChange={(e) => onUpdatePlan(selectedPlan.id, { name: e.target.value })} sx={{ flex: 1 }} />
        ) : (
          <Typography variant="h6" sx={{ flex: 1 }}>{selectedPlan.name}</Typography>
        )}
      </Box>
      
      <Box sx={{ p: 2, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 600, color: 'text.secondary', display: 'block', mb: 1 }}>Integration Mode</Typography>
          {canEditConnections ? (
            <Select fullWidth size="small" value={selectedPlan.integrationMode || 'appended'} onChange={(e) => onUpdatePlan(selectedPlan.id, { integrationMode: e.target.value })}>
              <MenuItem value="appended">Appended (Sequential)</MenuItem>
              <MenuItem value="interleaved">Interleaved (Alternating)</MenuItem>
              <MenuItem value="branched">Branched (Conditional)</MenuItem>
              <MenuItem value="embedded">Embedded (Nested)</MenuItem>
            </Select>
          ) : (
            <Paper variant="outlined" sx={{ p: 1, bgcolor: 'action.hover' }}><Typography variant="body2">{selectedPlan.integrationMode || 'appended'}</Typography></Paper>
          )}
        </Box>

        <Box>
          <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 600, color: 'text.secondary', display: 'block', mb: 1 }}>Parent Plan</Typography>
          {canEditConnections ? (
            <Select fullWidth size="small" value={selectedPlan.parentId || ''} onChange={(e) => onUpdatePlan(selectedPlan.id, { parentId: e.target.value || null })}>
              <MenuItem value="">None (Root Level)</MenuItem>
              {plans.filter(p => p.id !== selectedPlan.id && p.type === 'control').map(p => (<MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>))}
            </Select>
          ) : (
            <Paper variant="outlined" sx={{ p: 1, bgcolor: 'action.hover' }}><Typography variant="body2">{selectedPlan.parentId ? plans.find(p => p.id === selectedPlan.parentId)?.name || 'Unknown' : 'None (Root Level)'}</Typography></Paper>
          )}
        </Box>

        {canViewCode && (
          <Box>
            <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 600, color: 'text.secondary', display: 'block', mb: 1 }}>Generated Code ({language.toUpperCase()})</Typography>
            <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'action.hover', borderBottom: 1, borderColor: 'divider' }}>
                <CodeIcon fontSize="small" /><Typography variant="caption" fontWeight={500}>{selectedPlan.name}</Typography>
              </Box>
              {isEditable ? (
                <TextField fullWidth multiline rows={6} value={getPlanCode()} onChange={(e) => onUpdatePlan(selectedPlan.id, { customCode: e.target.value })} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }} inputProps={{ style: { fontFamily: 'monospace', fontSize: 12 } }} />
              ) : (
                <Box component="pre" sx={{ m: 0, p: 1.5, bgcolor: 'action.hover', overflowX: 'auto', fontFamily: 'monospace', fontSize: 12, lineHeight: 1.5 }}><code>{getPlanCode()}</code></Box>
              )}
            </Paper>
          </Box>
        )}

        <Box>
          <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 600, color: 'text.secondary', display: 'block', mb: 1 }}>Connections ({planConnections.length})</Typography>
          <Stack spacing={1}>
            {planConnections.map(conn => {
              const otherId = conn.from === selectedPlan.id ? conn.to : conn.from;
              const otherPlan = plans.find(p => p.id === otherId);
              return otherPlan ? (
                <Paper key={`${conn.from}-${conn.to}`} variant="outlined" sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip label={conn.mode} size="small" sx={{ bgcolor: getConnectionColor(conn.mode), color: 'white' }} />
                  <Typography variant="body2" sx={{ flex: 1 }}>{otherPlan.name}</Typography>
                  {canEditConnections && (<IconButton size="small" onClick={() => onRemoveConnection(conn.from, conn.to)}><CloseIcon fontSize="small" /></IconButton>)}
                </Paper>
              ) : null;
            })}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

function ExecutionControlsComponent({ engine, isRunning, isPaused, onStep, onReset, onSpeedChange, algorithm }) {
  const [speed, setSpeed] = useState(1);
  const handleSpeedChange = (e, newSpeed) => { setSpeed(newSpeed); if (onSpeedChange) onSpeedChange(newSpeed); };
  const algorithmNames = { selectionSort: 'Selection Sort', exchangeSort: 'Exchange Sort', exSelSort: 'ExSel Sort', insertionSort: 'Insertion Sort', custom: 'Custom Composition' };
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, bgcolor: 'action.hover', borderBottom: 1, borderColor: 'divider', flexWrap: 'wrap', gap: 2 }}>
      <ButtonGroup size="small" variant="outlined">
        <Tooltip title="Go"><Button onClick={() => engine && engine.start ? engine.start() : null} disabled={isRunning && !isPaused}><PlayArrowIcon fontSize="small" /> Go</Button></Tooltip>
        <Tooltip title="Pause"><Button onClick={() => engine && engine.pause ? engine.pause() : null} disabled={!isRunning || isPaused}><PauseIcon fontSize="small" /> Pause</Button></Tooltip>
        <Tooltip title="Step"><Button onClick={onStep} disabled={isRunning && !isPaused}>Step</Button></Tooltip>
        <Tooltip title="Reset"><Button onClick={onReset}><ReplayIcon fontSize="small" /> Reset</Button></Tooltip>
      </ButtonGroup>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2 }}>
        <SpeedIcon fontSize="small" /><Slider size="small" sx={{ width: 120 }} min={0.5} max={3} step={0.1} value={speed} onChange={handleSpeedChange} />
        <Typography variant="caption" sx={{ fontFamily: 'monospace', minWidth: 40 }}>{speed}x</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2 }}>
        <Typography variant="caption" color="text.secondary">Algorithm:</Typography>
        <Typography variant="body2" fontWeight={500} sx={{ fontFamily: 'monospace' }}>{algorithmNames[algorithm] || algorithm}</Typography>
      </Box>
    </Box>
  );
}

function DataVisualizationComponent({ data, step }) {
  const [animValue, setAnimValue] = useState(null);
  const [animPhase, setAnimPhase] = useState(null);

  useEffect(() => {
    if (step) {
      if (step.type === 'swap' || step.type === 'SWAP_END' || step.type === 'EXCHANGE_SWAP' || step.type === 'swap_start' || step.type === 'swap_end') {
        setAnimPhase('swapping');
        setAnimValue({ from: step.swapFrom, to: step.swapTo });
        setTimeout(() => setAnimPhase(null), 500);
      } else if (step.type === 'compare' || step.type === 'NEW_SMALLEST' || step.type === 'SELECTION_NEW_MIN' || step.type === 'new_smallest') {
        setAnimPhase('highlight');
        setAnimValue(step.smallestIndex);
        setTimeout(() => setAnimPhase(null), 300);
      } else if (step.type === 'insert') {
        setAnimPhase('highlight');
        setAnimValue(step.insertIndex);
        setTimeout(() => setAnimPhase(null), 300);
      }
    }
  }, [step]);

  const getBoxStatus = (idx) => ({
    sorted: data && data.sortedIndices && data.sortedIndices.includes(idx),
    pass: data && data.currentPass === idx,
    smallest: data && data.smallestIndex === idx,
    scan: data && data.scanIndex === idx,
    swapping: animPhase === 'swapping' && animValue && (animValue.from === idx || animValue.to === idx),
    highlight: animPhase === 'highlight' && animValue === idx,
  });

  if (!data || !data.array) return (<Box sx={{ p: 3, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography color="text.secondary">Click Go or Step to start execution</Typography></Box>);

  return (
    <Box sx={{ p: 2, flex: 1, overflowY: 'auto' }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, p: 1.5, bgcolor: 'action.hover', borderRadius: 2, flexWrap: 'wrap' }}>
        <Typography variant="body2"><strong>Comparisons:</strong> {data.comparisons || 0}</Typography>
        <Typography variant="body2"><strong>Swaps:</strong> {data.swaps || 0}</Typography>
        <Typography variant="body2"><strong>Current Pass:</strong> {data.currentPass + 1 || 1}</Typography>
        <Typography variant="body2"><strong>Array Size:</strong> {data.array.length || 0}</Typography>
      </Box>
      
      <Box sx={{ overflowX: 'auto', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', minWidth: 'max-content' }}>
          {data.array.map((val, idx) => {
            const status = getBoxStatus(idx);
            return (
              <Box key={idx} sx={{ position: 'relative' }}>
                <DataBox sorted={status.sorted} pass={status.pass} smallest={status.smallest} scan={status.scan} swapping={status.swapping} highlight={status.highlight}>
                  <Typography variant="h6" fontWeight={600}>{val}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>{idx}</Typography>
                </DataBox>
                <Box sx={{ position: 'absolute', bottom: -20, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                  {status.pass && <Typography variant="caption" sx={{ color: '#ff9800' }}>P</Typography>}
                  {status.smallest && <Typography variant="caption" sx={{ color: '#f44336' }}>S</Typography>}
                  {status.scan && <Typography variant="caption" sx={{ color: '#2196f3' }}>Scan</Typography>}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 2, p: 1, bgcolor: 'action.hover', borderRadius: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 20, height: 20, bgcolor: '#4caf50', borderRadius: 0.5 }} /><Typography variant="caption">Sorted</Typography></Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 20, height: 20, bgcolor: '#ff9800', borderRadius: 0.5 }} /><Typography variant="caption">Pass (P)</Typography></Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 20, height: 20, bgcolor: '#f44336', borderRadius: 0.5 }} /><Typography variant="caption">Smallest (S)</Typography></Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 20, height: 20, bgcolor: '#2196f3', borderRadius: 0.5 }} /><Typography variant="caption">Scan</Typography></Box>
      </Box>
      
      {step && (<Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'action.hover' }}><Typography variant="body2">{step.message}</Typography></Paper>)}
    </Box>
  );
}

function StatusBarComponent({ phase, phaseName, language, planCount, connectionCount, historyIndex, historyLength }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2, py: 0.75, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Typography variant="caption">{phaseName}</Typography>
      <Divider orientation="vertical" flexItem />
      <Typography variant="caption"><strong>Language:</strong> {language}</Typography>
      <Divider orientation="vertical" flexItem />
      <Typography variant="caption"><strong>Plans:</strong> {planCount}</Typography>
      <Divider orientation="vertical" flexItem />
      <Typography variant="caption"><strong>Connections:</strong> {connectionCount}</Typography>
      <Divider orientation="vertical" flexItem />
      <Typography variant="caption"><strong>History:</strong> {historyIndex + 1}/{historyLength}</Typography>
    </Box>
  );
}

function ShortcutsModalComponent({ onClose }) {
  const shortcuts = [
    { keys: ['Ctrl', 'Z'], desc: 'Undo last action' }, { keys: ['Ctrl', 'Y'], desc: 'Redo last action' },
    { keys: ['Ctrl', 'S'], desc: 'Save workspace to .vpcl file' }, { keys: ['Ctrl', 'O'], desc: 'Open workspace file' },
    { keys: ['Ctrl', '+'], desc: 'Zoom in' }, { keys: ['Ctrl', '-'], desc: 'Zoom out' },
    { keys: ['Ctrl', '0'], desc: 'Reset zoom' }, { keys: ['Delete'], desc: 'Delete selected plan' },
    { keys: ['?'], desc: 'Show this menu' }, { keys: ['Esc'], desc: 'Cancel connection mode' },
    { keys: ['Middle Click / Ctrl+Drag'], desc: 'Pan canvas' }, { keys: ['Drag Plan'], desc: 'Move plan on canvas' },
  ];
  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Keyboard Shortcuts</DialogTitle>
      <DialogContent><Stack spacing={1}>{shortcuts.map((shortcut, idx) => (<Paper key={idx} variant="outlined" sx={{ p: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{shortcut.keys.map((key, i) => (<React.Fragment key={i}><Chip label={key} size="small" variant="outlined" />{i < shortcut.keys.length - 1 && <span>+</span>}</React.Fragment>))}</Box><Typography variant="body2">{shortcut.desc}</Typography></Paper>))}</Stack></DialogContent>
    </Dialog>
  );
}

function TutorialPanelComponent({ step, currentStep, totalSteps, onNext, onSkip }) {
  const getTargetPosition = (targetId) => {
    if (!targetId) return { top: '20%', left: '20%' };
    const element = document.getElementById(targetId);
    if (element) { const rect = element.getBoundingClientRect(); return { top: rect.top + rect.height + 10, left: rect.left }; }
    return { top: '20%', left: '20%' };
  };
  const position = getTargetPosition(step.target);
  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(0,0,0,0.6)', zIndex: 2500 }}>
      <Paper sx={{ position: 'fixed', top: position.top, left: position.left, maxWidth: 350, p: 2.5, zIndex: 2501, borderLeft: 3, borderColor: 'primary.main' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="caption" sx={{ textTransform: 'uppercase', color: 'primary.main', fontWeight: 600 }}>Step {currentStep + 1} of {totalSteps}</Typography>
          <IconButton size="small" onClick={onSkip}><CloseIcon fontSize="small" /></IconButton>
        </Box>
        <Typography variant="h6" sx={{ mb: 1 }}>{step.title}</Typography>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>{step.content}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button size="small" onClick={onSkip}>Skip Tutorial</Button>
          <Button variant="contained" size="small" onClick={onNext}>{currentStep === totalSteps - 1 ? 'Finish' : 'Next'}</Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default function VisualPlanWorkspace() {
  const [plans, setPlans] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [language, setLanguage] = useState('c');
  const [phase, setPhase] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [connectMode, setConnectMode] = useState(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showExecution, setShowExecution] = useState(false);
  const [executionEngine, setExecutionEngine] = useState(null);
  const [executionData, setExecutionData] = useState(null);
  const [currentStep, setCurrentStep] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const { push, undo, redo, canUndo, canRedo, historyIndex, historyLength } = useUndoRedo();
  const fileInputRef = useRef(null);
  const isInitialMount = useRef(true);
  const positionUpdateTimeout = useRef(null);
  const pendingPositionUpdate = useRef(null);
  const reasoningService = useRef(new ReasoningService());

  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      setIsDarkMode(isDark);
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const addNotification = useCallback((message, severity = 'info') => setSnackbar({ open: true, message, severity }), []);

  const updateState = useCallback((newPlans, newConnections, skipHistory = false) => {
    setPlans(newPlans);
    setConnections(newConnections);
    if (!skipHistory) push(newPlans, newConnections);
    const reasoning = reasoningService.current.analyze(newPlans, newConnections, phase);
    if (reasoning.hasError) addNotification(reasoning.errorMessage, 'warning');
  }, [push, phase, addNotification]);

  const enrichPlanWithIcon = useCallback((plan) => {
    const libraryPlan = PLAN_LIBRARY.find(lp => lp.name === plan.name);
    if (libraryPlan) return { ...plan, icon: libraryPlan.icon, category: libraryPlan.category, description: libraryPlan.description };
    return plan;
  }, []);

  const addPlan = useCallback((template, x, y) => {
    if (phase !== 2 && phase !== 3) { addNotification('Cannot add plans in Phase 1', 'warning'); return; }
    let fullTemplate = template;
    if (template.id && !template.icon) {
      const found = PLAN_LIBRARY.find(p => p.id === template.id);
      if (found) fullTemplate = found;
    }
    const newPlan = { id: `p${nextId++}`, name: fullTemplate.name, type: fullTemplate.type, category: fullTemplate.category, icon: fullTemplate.icon, description: fullTemplate.description, x, y, customCode: '', integrationMode: 'appended' };
    updateState([...plans, newPlan], connections);
    addNotification(`Added ${fullTemplate.name}`, 'success');
  }, [plans, connections, updateState, addNotification, phase]);

  const removePlan = useCallback((id) => {
    if (phase !== 2 && phase !== 3) { addNotification('Cannot remove plans in Phase 1', 'warning'); return; }
    updateState(plans.filter(p => p.id !== id), connections.filter(c => c.from !== id && c.to !== id));
    if (selectedPlanId === id) setSelectedPlanId(null);
    addNotification('Plan removed', 'info');
  }, [plans, connections, updateState, selectedPlanId, addNotification, phase]);

  const updatePlan = useCallback((id, updates) => {
    if (phase === 1) { addNotification('Cannot edit plans in Phase 1', 'warning'); return; }
    updateState(plans.map(p => p.id === id ? { ...p, ...updates } : p), connections);
  }, [plans, connections, updateState, phase, addNotification]);

  const updatePlanPosition = useCallback((id, x, y) => {
    if (phase === 1) return;
    pendingPositionUpdate.current = { id, x, y };
    if (positionUpdateTimeout.current) clearTimeout(positionUpdateTimeout.current);
    positionUpdateTimeout.current = setTimeout(() => {
      if (pendingPositionUpdate.current) {
        const { id: pid, x: px, y: py } = pendingPositionUpdate.current;
        setPlans(prev => prev.map(p => p.id === pid ? { ...p, x: px, y: py } : p));
        pendingPositionUpdate.current = null;
      }
      positionUpdateTimeout.current = null;
    }, 100);
    setPlans(prev => prev.map(p => p.id === id ? { ...p, x, y } : p));
  }, [phase]);

  const onDragEnd = useCallback(() => {
    if (phase === 1) return;
    if (positionUpdateTimeout.current) clearTimeout(positionUpdateTimeout.current);
    if (pendingPositionUpdate.current) {
      const { id, x, y } = pendingPositionUpdate.current;
      const newPlans = plans.map(p => p.id === id ? { ...p, x, y } : p);
      push(newPlans, connections);
      pendingPositionUpdate.current = null;
    }
  }, [plans, connections, push, phase]);

  const addConnection = useCallback((from, to, mode = 'appended') => {
    if (phase === 1) { setConnectMode(null); addNotification('Cannot create connections in Phase 1', 'warning'); return; }
    if (from === to) return addNotification('Cannot connect to self', 'warning');
    if (connections.some(c => c.from === from && c.to === to)) return addNotification('Connection exists', 'warning');
    const isValid = reasoningService.current.validateConnection(plans, from, to, mode);
    if (!isValid.valid) { addNotification(isValid.error, 'warning'); setConnectMode(null); return; }
    updateState(plans, [...connections, { from, to, mode }]);
    addNotification(`Connected ${mode}`, 'success');
    setConnectMode(null);
  }, [plans, connections, updateState, addNotification, phase]);

  const removeConnection = useCallback((from, to) => {
    if (phase !== 2 && phase !== 3) { addNotification('Cannot remove connections in Phase 1', 'warning'); return; }
    updateState(plans, connections.filter(c => !(c.from === from && c.to === to)));
    addNotification('Connection removed', 'info');
  }, [plans, connections, updateState, addNotification, phase]);

  const clearWorkspace = useCallback(() => {
    if (phase !== 2 && phase !== 3) { addNotification('Cannot clear workspace in Phase 1', 'warning'); return; }
    updateState([], []);
    setSelectedPlanId(null);
    setConnectMode(null);
    addNotification('New workspace created', 'success');
  }, [updateState, addNotification, phase]);

  const saveWorkspace = useCallback(() => {
    const plansToSave = plans.map(p => ({ id: p.id, name: p.name, type: p.type, category: p.category, description: p.description, x: p.x, y: p.y, customCode: p.customCode, integrationMode: p.integrationMode, parentId: p.parentId }));
    saveWorkspaceToFile(plansToSave, connections, addNotification);
  }, [plans, connections, addNotification]);

  const openWorkspace = useCallback(() => fileInputRef.current?.click(), []);
  const handleFileLoad = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workspace = JSON.parse(event.target.result);
        const loadedPlans = (workspace.plans || []).map(plan => enrichPlanWithIcon(plan));
        updateState(loadedPlans, workspace.connections || [], true);
        setSelectedPlanId(null);
        addNotification('Workspace loaded successfully', 'success');
      } catch (err) { addNotification('Failed to load workspace: Invalid file', 'error'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, [enrichPlanWithIcon, updateState, addNotification]);

  const loadExample = useCallback((key) => {
    if (phase !== 1) { addNotification('Examples are only available in Phase 1 (Observation mode)', 'warning'); return; }
    const ex = EXAMPLES[key];
    if (ex) {
      const mapped = ex.plans.map(p => {
        const libraryPlan = PLAN_LIBRARY.find(l => l.name === p.name);
        return { ...p, icon: libraryPlan?.icon, category: libraryPlan?.category, description: libraryPlan?.description };
      });
      updateState(mapped, ex.connections, true);
      setSelectedPlanId(null);
      addNotification(`Loaded ${ex.name} for observation`, 'success');
      if (showTutorial) setTutorialStep(3);
    }
  }, [updateState, addNotification, phase, showTutorial]);

  const zoomIn = () => setZoom(z => Math.min(z + 0.1, 3));
  const zoomOut = () => setZoom(z => Math.max(z - 0.1, 0.3));
  const resetZoom = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const runExecution = useCallback(() => {
    if (phase === 1 && plans.length === 0) { addNotification('Load an example first using the dropdown', 'warning'); return; }
    if (plans.length === 0) { addNotification('No plans on canvas to execute', 'warning'); return; }
    let detectedAlgorithm = 'custom';
    const planNames = plans.map(p => p.name);
    if (planNames.includes('LSSE Plan')) detectedAlgorithm = 'selectionSort';
    else if (planNames.includes('CAE Plan')) detectedAlgorithm = 'exchangeSort';
    else if (planNames.includes('Guard Plan')) detectedAlgorithm = 'insertionSort';
    const engine = new ExecutionEngine(plans, connections, language, detectedAlgorithm);
    engine.on('onDataUpdate', (data, step) => { setExecutionData({ ...data }); setCurrentStep(step); });
    engine.on('onComplete', () => { setIsExecuting(false); setIsPaused(false); addNotification('Execution complete', 'success'); });
    const initData = engine.initialize();
    setExecutionEngine(engine);
    setExecutionData(initData);
    setShowExecution(true);
    setIsExecuting(false);
    setIsPaused(false);
    setCurrentStep(null);
  }, [plans, connections, language, addNotification, phase]);

  const handleExecutionStep = useCallback(() => { if (executionEngine) executionEngine.step(); }, [executionEngine]);
  const handleExecutionReset = useCallback(() => { if (executionEngine) { executionEngine.reset(); setExecutionData(executionEngine.data); setIsExecuting(false); setIsPaused(false); setCurrentStep(null); } }, [executionEngine]);
  const handleSpeedChange = useCallback((speed) => { if (executionEngine) executionEngine.setSpeed(speed); }, [executionEngine]);

  const handleUndo = useCallback(() => { const state = undo(); if (state) { setPlans(state.plans); setConnections(state.connections); setSelectedPlanId(null); setConnectMode(null); addNotification('Undo', 'success'); } }, [undo, addNotification]);
  const handleRedo = useCallback(() => { const state = redo(); if (state) { setPlans(state.plans); setConnections(state.connections); setSelectedPlanId(null); setConnectMode(null); addNotification('Redo', 'success'); } }, [redo, addNotification]);

  useKeyboardShortcuts({
    undo: handleUndo, redo: handleRedo, saveWorkspace, openWorkspace,
    zoomIn, zoomOut, resetZoom,
    deleteSelected: () => { if (selectedPlanId && phase !== 1) removePlan(selectedPlanId); },
    selectedPlanId, setShowShortcuts,
  });

  useEffect(() => { if (isInitialMount.current) { isInitialMount.current = false; push([], []); } }, [push]);

  const selectedPlan = plans.find(p => p.id === selectedPlanId);
  const phaseNames = { 1: 'Phase 1: Plan Observation (Rehearsal)', 2: 'Phase 2: Plan Integration (Partial Implementation)', 3: 'Phase 3: Plan Creation (Full Implementation)' };

  const handlePhaseChange = (newPhase) => {
    if (newPhase === 1) { setConnectMode(null); setSelectedPlanId(null); setShowExecution(false); setShowTutorial(true); setTutorialStep(0); }
    else setShowTutorial(false);
    setPhase(newPhase);
  };

  const currentAlgorithm = executionEngine ? executionEngine.getAlgorithm() : 'custom';
  const tutorialSteps = [
    { title: 'Welcome to VPCL Phase 1', content: 'This is the Plan Observation phase. You will learn how sorting algorithms work through visualization.', target: null },
    { title: 'Load an Example', content: 'Click "Load Example" and pick an algorithm to see its plan structure.', target: 'example-selector' },
    { title: 'Plans are Building Blocks', content: 'Each sorting algorithm is built from smaller plans like Input, Loop, Select Smallest, Exchange, and Output.', target: 'plan-library' },
    { title: 'Plan Connections', content: 'Plans are connected with colored lines. Green = Appended (sequential), Purple = Embedded (nested).', target: 'canvas' },
    { title: 'Run the Execution', content: 'Click the Run button to see the algorithm animate. Watch the Pass, Scan, and Smallest indicators!', target: 'run-button' },
    { title: 'Data Visualization', content: 'Sorted elements turn green. The Pass arrow shows current position. The Scan hand compares elements.', target: null },
    { title: 'Try Different Algorithms', content: 'Load different examples to compare Selection, Exchange, ExSel, and Insertion sorts.', target: 'example-selector' },
  ];

  const nextTutorialStep = () => {
    if (tutorialStep < tutorialSteps.length - 1) setTutorialStep(tutorialStep + 1);
    else { setShowTutorial(false); addNotification('Tutorial complete! Switch to Phase 2 to start building programs.', 'success'); }
  };

  const theme = getTheme(isDarkMode ? 'dark' : 'light');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={{
        '.navbar__link, .navbar__item, .navbar__brand': {
          fontWeight: '600 !important',
        },
        '.dropdown__link, .navbar__link--active, .navbar__link--active:hover': {
          fontWeight: '600 !important',
        },
      }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)', bgcolor: 'background.default', overflow: 'hidden' }}>
        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
        </Snackbar>

        {showTutorial && phase === 1 && (<TutorialPanelComponent step={tutorialSteps[tutorialStep]} currentStep={tutorialStep} totalSteps={tutorialSteps.length} onNext={nextTutorialStep} onSkip={() => setShowTutorial(false)} />)}

        <AppBar position="static" color="default" elevation={0} sx={{ flexShrink: 0 }}>
          <Toolbar variant="dense" sx={{ gap: 1, flexWrap: 'wrap', py: 1 }}>
            <ButtonGroup size="small" variant="outlined">
              <Tooltip title="Undo"><IconButton onClick={handleUndo} disabled={!canUndo}><UndoIcon /></IconButton></Tooltip>
              <Tooltip title="Redo"><IconButton onClick={handleRedo} disabled={!canRedo}><RedoIcon /></IconButton></Tooltip>
            </ButtonGroup>
            <Divider orientation="vertical" flexItem />
            <Button size="small" startIcon={<SaveIcon />} onClick={saveWorkspace}>Save</Button>
            <Button size="small" startIcon={<FolderOpenIcon />} onClick={openWorkspace}>Open</Button>
            <Button size="small" startIcon={<AddIcon />} onClick={clearWorkspace}>New</Button>
            <Divider orientation="vertical" flexItem />
            <ToggleButtonGroup size="small" value={phase} exclusive onChange={(e, v) => v && handlePhaseChange(v)}>
              <ToggleButton value={1}>Phase 1: Observation</ToggleButton>
              <ToggleButton value={2}>Phase 2: Integration</ToggleButton>
              <ToggleButton value={3}>Phase 3: Creation</ToggleButton>
            </ToggleButtonGroup>
            <Divider orientation="vertical" flexItem />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <MenuItem value="c">C Language</MenuItem>
                <MenuItem value="cpp">C++ Language</MenuItem>
                <MenuItem value="pascal">Pascal Language</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <Select defaultValue="" onChange={(e) => e.target.value && loadExample(e.target.value)} displayEmpty>
                <MenuItem value="" disabled>Load Example</MenuItem>
                <MenuItem value="selectionSort">Selection Sort</MenuItem>
                <MenuItem value="exchangeSort">Exchange Sort (Bubble)</MenuItem>
                <MenuItem value="exSelSort">ExSel Sort (Combined)</MenuItem>
                <MenuItem value="insertionSort">Insertion Sort</MenuItem>
              </Select>
            </FormControl>
            <Divider orientation="vertical" flexItem />
            <Tooltip title="Zoom Out"><IconButton size="small" onClick={zoomOut}><ZoomOutIcon /></IconButton></Tooltip>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', minWidth: 45, textAlign: 'center' }}>{Math.round(zoom * 100)}%</Typography>
            <Tooltip title="Zoom In"><IconButton size="small" onClick={zoomIn}><ZoomInIcon /></IconButton></Tooltip>
            <Tooltip title="Reset Zoom"><IconButton size="small" onClick={resetZoom}><CenterFocusStrongIcon /></IconButton></Tooltip>
            <Divider orientation="vertical" flexItem />
            <Button variant="contained" size="small" startIcon={<PlayArrowIcon />} onClick={runExecution} id="run-button">Run</Button>
            <Divider orientation="vertical" flexItem />
            <Tooltip title="Keyboard Shortcuts"><IconButton size="small" onClick={() => setShowShortcuts(true)}><HelpIcon /></IconButton></Tooltip>
          </Toolbar>
        </AppBar>

        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
          <PlanLibraryDrawer variant="permanent" open><PlanLibraryComponent phase={phase} /></PlanLibraryDrawer>
          <Canvas 
            plans={plans} 
            connections={connections} 
            selectedPlanId={selectedPlanId} 
            connectMode={connectMode} 
            zoom={zoom} 
            pan={pan} 
            setPan={setPan} 
            onSelectPlan={setSelectedPlanId} 
            onRemovePlan={removePlan} 
            onUpdatePlanPosition={updatePlanPosition} 
            onConnectStart={setConnectMode} 
            onConnectCancel={() => setConnectMode(null)} 
            onConnectTarget={(id) => {
              const sourcePlan = plans.find(p => p.id === connectMode);
              const mode = sourcePlan?.integrationMode || 'appended';
              addConnection(connectMode, id, mode);
            }} 
            onAddPlan={addPlan} 
            onDragEnd={onDragEnd} 
            phase={phase} 
          />
          <PropertiesDrawer variant="permanent" anchor="right" open><PropertiesPanelComponent selectedPlan={selectedPlan} plans={plans} language={language} onUpdatePlan={updatePlan} onRemoveConnection={removeConnection} connections={connections} phase={phase} /></PropertiesDrawer>
        </Box>

        <StatusBarComponent phase={phase} phaseName={phaseNames[phase]} language={language.toUpperCase()} planCount={plans.length} connectionCount={connections.length} historyIndex={historyIndex} historyLength={historyLength} />

        <input ref={fileInputRef} type="file" accept=".vpcl,.json" style={{ display: 'none' }} onChange={handleFileLoad} />
        {showShortcuts && <ShortcutsModalComponent onClose={() => setShowShortcuts(false)} />}
        
        {showExecution && executionData && (
          <Dialog open fullScreen onClose={() => setShowExecution(false)}>
            <AppBar sx={{ position: 'relative' }}><Toolbar><Typography sx={{ flex: 1 }} variant="h6">Program Execution</Typography><IconButton edge="end" color="inherit" onClick={() => setShowExecution(false)}><CloseIcon /></IconButton></Toolbar></AppBar>
            <ExecutionControlsComponent engine={executionEngine} isRunning={isExecuting} isPaused={isPaused} onStep={handleExecutionStep} onReset={handleExecutionReset} onSpeedChange={handleSpeedChange} algorithm={currentAlgorithm} />
            <DataVisualizationComponent data={executionData} step={currentStep} />
          </Dialog>
        )}
      </Box>
    </ThemeProvider>
  );
}