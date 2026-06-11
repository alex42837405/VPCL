import { styled, alpha } from '@mui/material/styles';
import { Box, Paper, Drawer } from '@mui/material';

export const StyledCanvas = styled(Box)(({ theme }) => ({
  flex: 1,
  position: 'relative',
  overflow: 'auto',
  backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
  cursor: 'default',
}));

export const CanvasContent = styled(Box)({
  position: 'relative',
  width: '3000px',
  height: '2000px',
  transformOrigin: '0 0',
});

export const GridLayer = styled('svg')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
});

export const SvgLayer = styled('svg')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
});

export const PlanCardStyled = styled(Paper)(({ theme, selected, connecting }) => ({
  position: 'absolute',
  width: '220px',
  padding: '12px',
  cursor: 'grab',
  transition: 'box-shadow 0.2s',
  zIndex: 10,
  userSelect: 'none',
  border: `2px solid ${selected ? theme.palette.primary.main : connecting ? '#eab308' : theme.palette.divider}`,
  boxShadow: selected ? `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}` : theme.shadows[2],
  '&:hover': { boxShadow: theme.shadows[4] },
  '&:active': { cursor: 'grabbing' },
  animation: connecting ? 'pulse 0.8s infinite' : 'none',
  '@keyframes pulse': {
    '0%, 100%': { boxShadow: `0 0 0 0 ${alpha('#eab308', 0.4)}` },
    '50%': { boxShadow: `0 0 0 4px ${alpha('#eab308', 0.2)}` },
  },
}));

export const PlanLibraryDrawer = styled(Drawer)({
  width: 280,
  flexShrink: 0,
  '& .MuiDrawer-paper': { width: 280, position: 'relative', height: '100%' },
});

export const PropertiesDrawer = styled(Drawer)({
  width: 320,
  flexShrink: 0,
  '& .MuiDrawer-paper': { width: 320, position: 'relative', height: '100%' },
});

export const DataBox = styled(Box)(({ theme, sorted, pass, smallest, scan, swapping, highlight }) => ({
  width: '70px',
  height: '80px',
  backgroundColor: sorted ? '#4caf50' : swapping ? '#ff9800' : highlight ? '#f44336' : smallest ? '#f44336' : theme.palette.background.paper,
  border: `2px solid ${pass ? '#ff9800' : scan ? '#2196f3' : smallest ? '#f44336' : theme.palette.divider}`,
  borderWidth: pass || scan ? '3px' : '2px',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s',
  color: (sorted || smallest) ? 'white' : theme.palette.text.primary,
  animation: swapping ? 'swapPulse 0.3s ease-in-out' : highlight ? 'flash 0.3s ease-in-out' : 'none',
  '@keyframes flash': {
    '0%': { opacity: 1 },
    '50%': { opacity: 0.5 },
    '100%': { opacity: 1 },
  },
  '@keyframes swapPulse': {
    '0%': { transform: 'scale(1)', backgroundColor: '#ff9800' },
    '50%': { transform: 'scale(1.1)', backgroundColor: '#ff5722' },
    '100%': { transform: 'scale(1)', backgroundColor: '#ff9800' },
  },
}));