export const EXAMPLES = {
  selectionSort: {
    name: 'Selection Sort',
    description: 'Finds the smallest element and places it at the beginning repeatedly',
    plans: [
      { id: 'p1', name: 'Input Plan', type: 'input', x: 80, y: 200, integrationMode: 'appended', parentId: null, customCode: '' },
      { id: 'p2', name: 'LSSE Plan', type: 'composite', x: 350, y: 200, integrationMode: 'appended', parentId: null, customCode: '' },
      { id: 'p3', name: 'Output Plan', type: 'output', x: 620, y: 200, integrationMode: 'appended', parentId: null, customCode: '' },
    ],
    connections: [
      { from: 'p1', to: 'p2', mode: 'appended' },
      { from: 'p2', to: 'p3', mode: 'appended' },
    ],
  },
  exchangeSort: {
    name: 'Exchange Sort',
    description: 'Bubble sort where it swaps adjacent elements if they are in wrong order',
    plans: [
      { id: 'e1', name: 'Input Plan', type: 'input', x: 80, y: 200, integrationMode: 'appended', parentId: null, customCode: '' },
      { id: 'e2', name: 'Loop Plan', type: 'control', x: 350, y: 150, integrationMode: 'embedded', parentId: null, customCode: '' },
      { id: 'e3', name: 'CAE Plan', type: 'composite', x: 350, y: 320, integrationMode: 'embedded', parentId: 'e2', customCode: '' },
      { id: 'e4', name: 'Output Plan', type: 'output', x: 620, y: 235, integrationMode: 'appended', parentId: null, customCode: '' },
    ],
    connections: [
      { from: 'e1', to: 'e2', mode: 'appended' },
      { from: 'e2', to: 'e3', mode: 'embedded' },
      { from: 'e3', to: 'e4', mode: 'appended' },
    ],
  },
  exSelSort: {
    name: 'ExSel Sort',
    description: 'Combines Exchange and Selection sorts for efficiency',
    plans: [
      { id: 'x1', name: 'Input Plan', type: 'input', x: 80, y: 200, integrationMode: 'appended', parentId: null, customCode: '' },
      { id: 'x2', name: 'Loop Plan', type: 'control', x: 350, y: 120, integrationMode: 'interleaved', parentId: null, customCode: '' },
      { id: 'x3', name: 'CAE Plan', type: 'composite', x: 280, y: 320, integrationMode: 'interleaved', parentId: 'x2', customCode: '' },
      { id: 'x4', name: 'Select Smallest Plan', type: 'search', x: 480, y: 320, integrationMode: 'interleaved', parentId: 'x2', customCode: '' },
      { id: 'x5', name: 'Exchange Plan', type: 'swap', x: 680, y: 320, integrationMode: 'appended', parentId: null, customCode: '' },
      { id: 'x6', name: 'Output Plan', type: 'output', x: 80, y: 480, integrationMode: 'appended', parentId: null, customCode: '' },
    ],
    connections: [
      { from: 'x1', to: 'x2', mode: 'appended' },
      { from: 'x2', to: 'x3', mode: 'interleaved' },
      { from: 'x2', to: 'x4', mode: 'interleaved' },
      { from: 'x4', to: 'x5', mode: 'appended' },
      { from: 'x5', to: 'x6', mode: 'appended' },
    ],
  },
  insertionSort: {
    name: 'Insertion Sort',
    description: 'Builds sorted array by inserting elements one by one',
    plans: [
      { id: 'i1', name: 'Input Plan', type: 'input', x: 80, y: 200, integrationMode: 'appended', parentId: null, customCode: '' },
      { id: 'i2', name: 'Loop Plan', type: 'control', x: 350, y: 150, integrationMode: 'embedded', parentId: null, customCode: '' },
      { id: 'i3', name: 'Guard Plan', type: 'control', x: 350, y: 320, integrationMode: 'embedded', parentId: 'i2', customCode: '' },
      { id: 'i4', name: 'Exchange Plan', type: 'swap', x: 600, y: 320, integrationMode: 'appended', parentId: null, customCode: '' },
      { id: 'i5', name: 'Output Plan', type: 'output', x: 800, y: 235, integrationMode: 'appended', parentId: null, customCode: '' },
    ],
    connections: [
      { from: 'i1', to: 'i2', mode: 'appended' },
      { from: 'i2', to: 'i3', mode: 'embedded' },
      { from: 'i3', to: 'i4', mode: 'appended' },
      { from: 'i4', to: 'i5', mode: 'appended' },
    ],
  },
};