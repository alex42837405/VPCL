import { MdInput, MdOutput, MdLoop, MdCompareArrows, MdSwapHoriz, MdSearch, MdWarningAmber, MdAccountTree, MdCallMerge, MdAddCircle, MdCallSplit } from 'react-icons/md';

export const PLAN_CATEGORIES = {
  basic: { name: 'Basic I/O', icon: MdInput, color: '#3b82f6' },
  arithmetic: { name: 'Arithmetic', icon: MdCallMerge, color: '#22c55e' },
  control: { name: 'Control Flow', icon: MdLoop, color: '#eab308' },
  search: { name: 'Search & Compare', icon: MdSearch, color: '#a855f7' },
  swap: { name: 'Swap & Exchange', icon: MdSwapHoriz, color: '#ec489a' },
  composite: { name: 'Composite Plans', icon: MdAccountTree, color: '#14b8a6' },
  error: { name: 'Error Handling', icon: MdWarningAmber, color: '#ef4444' },
};

export const PLAN_LIBRARY = [
  { id: 'input', name: 'Input Plan', type: 'input', category: 'basic', icon: MdInput, description: 'Gets data from user or file' },
  { id: 'output', name: 'Output Plan', type: 'output', category: 'basic', icon: MdOutput, description: 'Displays results to user' },
  { id: 'sum', name: 'SumAll Plan', type: 'accumulator', category: 'arithmetic', icon: MdCallMerge, description: 'Accumulates sum of values' },
  { id: 'count', name: 'CountAll Plan', type: 'counter', category: 'arithmetic', icon: MdAddCircle, description: 'Counts number of items' },
  { id: 'loop', name: 'Loop Plan', type: 'control', category: 'control', icon: MdLoop, description: 'Iterates over data items' },
  { id: 'guard', name: 'Guard Plan', type: 'control', category: 'control', icon: MdCallSplit, description: 'Conditional branch / decision' },
  { id: 'selectSmallest', name: 'Select Smallest Plan', type: 'search', category: 'search', icon: MdSearch, description: 'Finds smallest value in array' },
  { id: 'compareAdjacent', name: 'Compare Adjacents Plan', type: 'compare', category: 'search', icon: MdCompareArrows, description: 'Compares adjacent elements' },
  { id: 'exchange', name: 'Exchange Plan', type: 'swap', category: 'swap', icon: MdSwapHoriz, description: 'Swaps two values' },
  { id: 'lSSE', name: 'LSSE Plan', type: 'composite', category: 'composite', icon: MdAccountTree, description: 'Loop Select Smallest Exchange' },
  { id: 'cae', name: 'CAE Plan', type: 'composite', category: 'composite', icon: MdAccountTree, description: 'Compare Adjacents Exchange' },
  { id: 'errorHandler', name: 'Error Handler Plan', type: 'error', category: 'error', icon: MdWarningAmber, description: 'Handles errors like division by zero' },
];